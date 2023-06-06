import { User } from './users.model'

const findLastUserId = async () => {
  const lastUser = await User.findOne({}, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean()
  console.log(lastUser)

  return lastUser?.id
}

const generateUserId = async () => {
  const currentId = (await findLastUserId()) || (0).toString().padStart(5, '0')
  const incretmentedId = (parseInt(currentId as string) + 1)
    .toString()
    .padStart(5, '0')
  return incretmentedId
}

export default {
  generateUserId,
}
