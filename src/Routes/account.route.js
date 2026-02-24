import express from 'express'
import { createAccount, getAccounts, getBalance } from '../Controllers/account.cont.js';
import { authMiddleware } from '../Middleware/auth.middle.js';


const accountrouter = express.Router()


accountrouter.post("/create",authMiddleware,createAccount)

accountrouter.get("/get",authMiddleware,getAccounts)

accountrouter.get("/balance/:accountId",authMiddleware,getBalance)

export default accountrouter;