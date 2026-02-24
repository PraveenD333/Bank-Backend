import { model, Schema } from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new Schema({

    name: {
        type: String,
        required: [true, "Name Is Required for Creating a User"]
    },
    email: {
        type: String,
        required: [true, "Email Is Required for Creating a User"],
        unique: [true, "Email Already Exists"],
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please Enter a Valid Email"]
    },
    password: {
        type: String,
        required: [true, "Password Is Required for Creating a User"],
        minlength: [6, "Password Must Be Atleast 6 Characters"],
        select: false
    },
    stsyemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }
}, { timestamps: true })

userSchema.pre('save', async function () {

    if (!this.isModified('password')) return

    const hash = await bcrypt.hash(this.password, 12)
    this.password = hash
    return
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const userModel = model('User', userSchema)

export default userModel;