import mongoose from "mongoose"
import accountModel from "../Model/account.model.js"
import ledgerModel from "../Model/ledger.model.js"
import transactionModel from "../Model/transation.model.js"
import { errorResponse, successResponse } from "../Services/response.js"
import { sendTransaction } from "../Services/email.js"
import { generateIdempotanceKey } from "../Services/RandomGenerator.js"


export const createTransaction = async (req, res) => {
    let session;
    try {
        //Validate Request
        const { fromAccount, toAccount, amount } = req.body

        if (!fromAccount || !toAccount || !amount) {
            return errorResponse(res, 400, "All Fields Are Required")
        }

        const idempotanceKey = generateIdempotanceKey()

        const fromUserAccount = await accountModel.findOne({
            _id: fromAccount
        }).populate("user", "name email")

        const toUserAccount = await accountModel.findOne({
            _id: toAccount
        }).populate("user", "name email")

        if (!fromUserAccount || !toUserAccount) {
            return errorResponse(res, 404, "Account Not Found")
        }

        //validate idempotency Key
        const existingTransaction = await transactionModel.findOne({
            idempotanceKey: idempotanceKey
        })

        if (existingTransaction) {
            switch (existingTransaction.status) {

                case "COMPLETED":
                    return successResponse(res, 200, "Transaction Already Processed", { transaction: existingTransaction });

                case "PENDING":
                    return successResponse(res, 200, "Transaction is Still Pending");

                case "FAILED":
                    return errorResponse(res, 500, "Transaction Failed");

                case "REVERSED":
                    return successResponse(res, 200, "Transaction Already Reversed");

                default:
                    return errorResponse(res, 500, "Transaction Not Existed");
            }
        }

        //Check Account Status
        if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
            return errorResponse(res, 400, "Both fromAccount and toAccount must be active")
        }

        // Derive sender balance from ledger
        const balance = await fromUserAccount.getBalance()

        if (balance < amount) {
            return errorResponse(res, 400, `Insufficient Balance Current Balance is ${balance} requsted amount is ${amount}`)
        }

        //Create Transaction
        session = await mongoose.startSession()
        let createdTransaction;
        await session.withTransaction(async () => {

            const [transactionDoc] = await transactionModel.create([{
                fromAccount,
                toAccount,
                amount,
                idempotanceKey
            }], { session })

            createdTransaction = transactionDoc

            await ledgerModel.create([{
                account: fromAccount,
                transaction: transactionDoc._id,
                amount: amount,
                type: "DEBIT"
            }], { session })

            await (() => {
                return new Promise((resolve) => setTimeout(resolve, 5000))
            })()

            await ledgerModel.create([{
                account: toAccount,
                transaction: transactionDoc._id,
                amount: amount,
                type: "CREDIT"
            }], { session })

            transactionDoc.status = "COMPLETED"
            await transactionDoc.save({ session })
        })
        session.endSession()


        // Send Email Notification
        await sendTransaction(
            fromUserAccount.user,
            toUserAccount.user,
            {
                accountNumber: fromUserAccount.accountNumber,
                name: fromUserAccount.user.name
            },
            {
                accountNumber: toUserAccount.accountNumber,
                name: toUserAccount.user.name
            },
            amount
        )

        return successResponse(res, 201, "Transaction Created Successfully", {
            transaction: createdTransaction
        })

    } catch (error) {
        return errorResponse(res, 500, "Transaction is Failed due to some issue please Try after some time")
    }
}

export const createInitialFunds = async (req, res) => {
    try {
        const { toAccount, amount } = req.body

        if (!toAccount || !amount) {
            return errorResponse(res, 400, "All Fields Are Required")
        }

        const idempotanceKey = generateIdempotanceKey()

        const toUserAccount = await accountModel.findOne({
            _id: toAccount
        })

        if (!toUserAccount) {
            return errorResponse(res, 404, "Account Not Found")
        }

        const fromUserAccount = await accountModel.findOne({
            user: req.user._id
        })

        if (!fromUserAccount) {
            return errorResponse(res, 404, "SystemUser Account Not Found")
        }

        const session = await mongoose.startSession()
        session.startTransaction()

        const transaction = new transactionModel({
            fromAccount: fromUserAccount._id,
            toAccount: toUserAccount._id,
            amount,
            idempotanceKey,
            status: "PENDING"
        })

        const debitLedger = await ledgerModel.create([{
            account: fromUserAccount._id,
            transaction: transaction._id,
            amount: amount,
            type: "DEBIT"
        }], { session })

        const creditLedger = await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session })

        transaction.status = "COMPLETED"
        await transaction.save({ session })

        await session.commitTransaction()
        session.endSession()

        return successResponse(res, 201, "Initial Funds Created Successfully", {
            transaction
        })

    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}