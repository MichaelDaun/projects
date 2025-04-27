import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

export const model = {}

const Schema = mongoose.Schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

const UserModel = mongoose.model('User', userSchema)

model.add = async (username, password) => {
  try {
    const hashedPassword = await model.hashPassword(password)
    if (model.userNameAvailable(username) && hashedPassword) {
      const newUser = new UserModel({
        username,
        password: hashedPassword
      })
      await newUser.save()
      return true
    }
    return false
  } catch (error) {
    throw new Error(error)
  }
}

model.hashPassword = async (plainPassword, saltrounds = 10) => {
  const hashedPassword = await bcrypt.hash(plainPassword, saltrounds)
  return hashedPassword
}

model.userNameAvailable = async (username) => {
  const existingUser = await UserModel.findOne({ username })
  return !existingUser
}

model.listAll = async () => {
  const users = await UserModel.find()
  return users
}

model.deleteAll = async () => {
  await UserModel.deleteMany({})
}

model.deleteUser = async (username) => {
  try {
    const result = await UserModel.deleteOne({ username: `${username}` })
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting user:', error)
    return false
  }
}

model.comparePassword = async (username, enteredPassword) => {
  const user = await UserModel.findOne({ username })

  if (!user) {
    return false
  }

  return await bcrypt.compare(enteredPassword, user.password)
}

export default model
