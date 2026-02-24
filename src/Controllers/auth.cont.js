import { errorResponse, successResponse } from "../Services/response.js"
import { sendEmail } from "../Services/email.js"
import generateToken from "../Services/generatetoken.js"
import backlistModel from "../Model/balacklist.model.js"
import userModel from "../Model/uers.model.js"


export const register = async (req, res) => {

    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return errorResponse(res, 400, "All Fields Are Required")
        }

        const userAlredyExists = await userModel.findOne({ email })
        if (userAlredyExists) {
            return errorResponse(res, 422, "User Already Exists")
        }

        const user = await userModel.create({
            name,
            email,
            password
        })
        await sendEmail(user)

        return successResponse(res, 201, "User Created Successfully",
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            })
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return errorResponse(res, 400, "All Fields Are Required")
        }

        const user = await userModel.findOne({ email }).select("+password")
        if (!user) {
            return errorResponse(res, 404, "User Not Found")
        }

        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) {
            return errorResponse(res, 401, "Invalid Credentials")
        }

        const token = generateToken(user)
        res.cookie("token", token)

        return successResponse(res, 200, "User Logged In Successfully",
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                },
                token
            })
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}

export const logout = async (req, res) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return successResponse(res, 200, "User Already Logged Out")
        }

        await backlistModel.create({ token })
        res.clearCookie("token") 

        return successResponse(res, 200, "User Logged Out Successfully")
    } catch (error) {
        return errorResponse(res, 500, error.message)

    }
}