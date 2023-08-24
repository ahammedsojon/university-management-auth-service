import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { IUser } from './user.interface';
import { User } from './user.model';
import usersUtils from './user.utils';

const createUserToDB = async (user: IUser): Promise<IUser | null> => {
  user.id = await usersUtils.generateUserId();
  user.password = (user.password || config.default_password) as string;
  const createdUser = await User.create(user);
  if (!createdUser) {
    throw new ApiError(400, 'Failed to create user');
  }
  return createdUser;
};

export const UserService = {
  createUserToDB,
};
