import { model, Schema } from "mongoose";

const backlistSchema = new Schema({
    token: {
        type: String,
        required: [true, "Token Is Required for Creating a Backlist"],
        unique: [true, "Token Already Exists"],
        index: true
    }
}, { timestamps: true })

backlistSchema.index({ createdAt: 1 }, {
    expireAfterSeconds: 60 * 60 * 24 * 1
})

const backlistModel = model('Backlist', backlistSchema)

export default backlistModel;