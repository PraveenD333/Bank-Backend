import accountModel from "../Model/account.model.js"
import { generateAccountNumber } from "../Services/RandomGenerator.js"
import { errorResponse, successResponse } from "../Services/response.js"


export const createAccount = async (req, res) => {

    try {
        const user = req.user
        const accountNumber = generateAccountNumber()
        
        const account = await accountModel.create({
            user: user._id,
            accountNumber: accountNumber
        })

        return successResponse(res, 201, "Account Created Successfully", {
            id: account._id,
            user:{id:user._id, name: user.name, email: user.email},
            accountNumber: account.accountNumber,
            status: account.status,
            currency: account.currency,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt
        })

    } catch (error) {
        errorResponse(res, 500, error.message)
    }
}

export const getAccounts = async (req, res) => {
    
    const accounts = await accountModel.find({
        user: req.user._id
    })
    return successResponse(res, 200, "Accounts Fetched Successfully", accounts)
}

export const getBalance = async (req, res) => {

    const { accountId } = req.params
    if (!accountId) {
        return errorResponse(res, 400, "Account Id Is Required")
    }

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })
    if (!account) {
        return errorResponse(res, 404, "Account Not Found")
    }
    
    const balance = await account.getBalance()
    return successResponse(res, 200, "Balance Fetched Successfully", { accountId: accountId, balance: balance })
}