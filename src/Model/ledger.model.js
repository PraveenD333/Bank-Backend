import { model, Schema } from "mongoose";

const ledgerSchema = new Schema({

    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, "Ledger Must Be Associated with a Account"],
        index: true,
        imutable: true
    },
    transaction: {
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        required: [true, "Ledger Must Be Associated with a Transaction"],
        index: true,
        imutable: true
    },
    amount: {
        type: Number,
        required: [true, "Amount Is Required for Creating a Ledger"],
        imutable: true
    },
    type: {
        type: String,
        enum: {
            values: ["CREDIT", "DEBIT"],
            message: "Type can be either CREDIT or DEBIT"
        },
        required: [true, "Type Is Required for Creating a Ledger"],
        imutable: true
    }
},{timestamps: true})

function preventLedgerModification () {
    throw new Error("Ledger Cannot Be Modified")
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification)
ledgerSchema.pre('findOneAndReplace', preventLedgerModification)
ledgerSchema.pre('findOneAndDelete', preventLedgerModification)

ledgerSchema.pre('updateOne', preventLedgerModification)
ledgerSchema.pre('updateMany', preventLedgerModification)
ledgerSchema.pre('deleteOne', preventLedgerModification)
ledgerSchema.pre('deleteMany', preventLedgerModification)

ledgerSchema.pre('replaceOne', preventLedgerModification)
ledgerSchema.pre('remove', preventLedgerModification)



const ledgerModel = model('Ledger', ledgerSchema)

export default ledgerModel