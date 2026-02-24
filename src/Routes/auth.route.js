import express from "express"
import { login, logout, register } from "../Controllers/auth.cont.js";


const authrouter = express.Router()


authrouter.post("/register",register)
authrouter.post("/login",login)
authrouter.post("/logout",logout)



export default authrouter;