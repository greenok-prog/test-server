import express from 'express'
import mongoose from 'mongoose'
import config from 'config'
import corsMiddlware from './middleware/cors.middleware.js'
import bodyParser from 'body-parser'
import cors from 'cors'

import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import cardRouter from './routes/card.routes.js'
import path from 'path'

const app = express()
const PORT = process.env.PORT || config.get("serverPort")

app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())
app.use(express.json())
app.use(express.static('static'))

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/cards", cardRouter)

const start = async () => {
    try {
        const dbUrl = await config.get("dbUrl")
        await mongoose.connect(process.env.MONGODB_URI || dbUrl)

        app.listen(PORT, () => {


            console.log(`Сервер запущен на ${PORT} порту`);
        })
    } catch (error) {
        console.log(error);
    }
}
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}
start()