import jwt from 'jsonwebtoken'
import { errorResponse } from '../Services/response.js'
import userModel from '../Model/uers.model.js'
import backlistModel from '../Model/balacklist.model.js'

export const authMiddleware = async (req, res, next) => {

    try {
        const token = req.cookies.token
        if (!token) {
            return errorResponse(res, 401, "Unauthorized access token is missing")
        }

        const isblacklisted = await backlistModel.findOne({ token })
        if (isblacklisted) {
            return errorResponse(res, 401, "Unauthorized access token is blacklisted")
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id)
        if (!user) {
            return errorResponse(res, 404, "User Not Found")
        }
        req.user = user
        return next()
        
    } catch (error) {
        return errorResponse(res, 500, "Unauthorized access token is invalid")
    }
}

export const authSystemUserMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return errorResponse(res, 401, "Unauthorized access token is missing")
        }
        const isblacklisted = await backlistModel.findOne({ token })
        if (isblacklisted) {
            return errorResponse(res, 401, "Unauthorized access token is blacklisted")
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id).select("+stsyemUser")
        if (!user.stsyemUser) {
            return errorResponse(res, 404, "User Not Found")
        }
        req.user = user
        return next()
    } catch (error) {
        return errorResponse(res, 500, "Unauthorized access token is invalid")
    }
}