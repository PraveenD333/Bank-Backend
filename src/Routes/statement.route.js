import express from "express"
import { generateMonthlyStatement } from "../Controllers/statement.cont.js";
import { authMiddleware } from "../Middleware/auth.middle.js";


const statementrouter = express.Router()

statementrouter.get("/monthly",authMiddleware,generateMonthlyStatement);

export default statementrouter;