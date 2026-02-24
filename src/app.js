import dotenv from 'dotenv'
dotenv.config({quiet:true})
import express from 'express'
import cookieParser from 'cookie-parser'
import AuthRoutes from './Routes/auth.route.js'
import AccountRoutes from './Routes/account.route.js'
import TransactionRoutes from './Routes/transaction.route.js'
import StatementRoutes from './Routes/statement.route.js'   



const app = express()


//Middleware
app.use(express.json())
app.use(cookieParser())


//Routes
app.use('/api/auth',AuthRoutes)
app.use('/api/account',AccountRoutes)
app.use('/api/transaction',TransactionRoutes)
app.use('/api/statement',StatementRoutes)




export default app