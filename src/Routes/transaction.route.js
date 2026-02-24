import express from "express";
import {authMiddleware,authSystemUserMiddleware } from "../Middleware/auth.middle.js";
import { createInitialFunds, createTransaction } from "../Controllers/transation.cont.js";



const transactionrouter = express.Router()


transactionrouter.post("/tran",authMiddleware,createTransaction)

transactionrouter.post("/system/initial-funds",authSystemUserMiddleware,createInitialFunds)


export default transactionrouter;