import http from 'http'
import app from './src/app.js'
import connectDB from './src/Database/db.js'


const PORT = process.env.PORT || 9000

const server = http.createServer(app)

server.listen(PORT, () => {
    console.log(`Server is Running... ${PORT}`);
    connectDB()
})