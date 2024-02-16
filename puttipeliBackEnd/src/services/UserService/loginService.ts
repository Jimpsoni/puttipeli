import { User } from "./userSchema"
import { checkPassword } from "../helperFunctions"
import mongoose from "mongoose"

export const checkLoginCredit = async (
  username: string,
  password: string
): Promise<boolean> => {
  await mongoose.connect(process.env.DB_URI as string)
  return User.findOne({ username: `${username}` })
    .then( async (user: unknown) => {
      if (!user) {
        await mongoose.connection.close()
        return false
      }

      if (typeof user ==='object' && 'password' in user && typeof user.password == 'string') {
        if (await checkPassword(user.password, password)) {
          await mongoose.connection.close()
          return true
        }
      }

      await mongoose.connection.close()
      return false
    })
    .catch(async () => {
      await mongoose.connection.close()
      return false
    })
}
