import { Schema, model } from "mongoose";
import ledgerModel from "./ledger.model.js";


const accountSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Account Must be Associated To A User"],
        index: true,
    },
    accountNumber: {
        type: String,
        unique: [true, "Account Number Already Exists"],
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            message: "Status can be either ACTIVE, FROZEN or CLOSED",
        },
        default: "ACTIVE"
    },
    currency: {
        type: String,
        required: [true, "Currency Is Required"],
        default: "INR"
    }
}, { timestamps: true })

accountSchema.index({ user: 1, status: 1 })

accountSchema.methods.getBalance = async function () {
    const balance = await ledgerModel.aggregate([
        { $match: { account: this._id } },
        { $group: { _id: null, totalDebit: { $sum: { $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0] } }, totalCredit: { $sum: { $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0] } } } },
        { $project: { _id: 0, balance: { $subtract: ["$totalCredit", "$totalDebit"] } } }
    ])

    if(balance.length === 0){
        return 0
    }else{
        return balance[0].balance
    }
}

const accountModel = model('Account', accountSchema)

export default accountModel;