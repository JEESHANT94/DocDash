import mongoose from 'mongoose'
const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB')
        })
        mongoose.connection.on('error', (err) => {
            console.log('Error connecting to MongoDB', err)
        })
        await mongoose.connect(`${process.env.MONGODB_URL}/docdash`)
    } catch (error) {
        console.log('Error connecting to MongoDB', error)
    }
}

export default connectDB