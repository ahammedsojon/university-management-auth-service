import config from '../../../config'
import { IUser } from './users.interface'
import { User } from './users.model'
import usersUtils from './users.utils'

const createUserToDB = async (user: IUser): Promise<IUser | null> => {
  user.id = await usersUtils.generateUserId()
  user.password = (user.password || config.default_password) as string
  const result = await User.create(user)
  return result
}

export default {
  createUserToDB,
}
