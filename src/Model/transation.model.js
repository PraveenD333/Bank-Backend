import { model, Schema } from "mongoose";

const transationSchema = new Schema({

    fromAccount: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, "Transation Must Be Associated with a from Account"],
        index: true
    },
    toAccount: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, "Transation Must Be Associated with a from Account"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message: "Status can be either PENDING, COMPLETED, FAILED or REVERSED"
        },
        default: "PENDING"
    },
    amount: {
        type: Number,
        required: [true, "Amount Is Required for Creating a Transation"],
        min: [0, "Amount Cannot Be Negative"]
    },
    idempotanceKey:{
        type: String,
        unique: true,
        required:[true,"Idempotance Key Is Required for Creating a Transation"],
        index: true
    }
}, { timestamps: true })

transationSchema.index({ fromAccount: 1, toAccount: 1, status: 1 })


const transactionModel = model('Transaction', transationSchema)

export default transactionModel