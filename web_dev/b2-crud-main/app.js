import mongoose from 'mongoose'
import expressApp from './src/express.js'
import createTestDbEntries from './src/test/dbTestEntries.js'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/${process.env.MONGO_INITDB_DATABASE}?authSource=admin`

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB Connected Successfully')

    // create test entries
    await createTestDbEntries()
  } catch (err) {
    console.error('MongoDB Connection Failed:', err)
    process.exit(1)
  }
}

await connectDB()
expressApp()
