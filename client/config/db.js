const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MOngodb connected ${mongoose.connection.host}`)
    } catch (error) {
        console.log(`mongodb server error ${error}`)
    }
}
module.exports = connectDB;