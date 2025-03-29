import express from 'express'
import connectDB from './config/mongodb.js'
import cors from 'cors'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import paymentRouter from './routes/paymentRoute.js'

import 'dotenv/config'
//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()
//middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
app.use('/api/payment', paymentRouter)

app.get('/', (req, res) => {
    res.send('Api working ')
})

//listen
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})