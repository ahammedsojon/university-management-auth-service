import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import {
  ILoginUser,
  ILoginUserResponse,
  IPasswordChange,
} from './auth.interface';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { jwtHelper } from '../../../helpers/jwtHelper';
import config from '../../../config';
import { IUser } from '../user/user.interface';
import bcrypt from 'bcrypt';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;

  const user = new User();
  const userExist = await user.isUserExist(id);
  if (!userExist) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credential!');
  }
  if (
    userExist?.password &&
    !user.isPasswordMatched(password, userExist?.password)
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password isn't correct!");
  }
  const { id: userId, role, needsPasswordChange } = userExist;
  const accessToken = jwtHelper.createToken(
    {
      userId,
      role,
      needsPasswordChange,
    },
    config.jwt.secret as Secret,
    config.jwt.expries_in as string
  );
  const refreshToken = jwtHelper.createToken(
    {
      userId,
      role,
      needsPasswordChange,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_exprires_in as string
  );
  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelper.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
  }
  const { id } = verifiedToken;
  const user = new User();
  const userExist = await user.isUserExist(id);
  if (!userExist) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User does not exist!');
  }
  const newAccessToken = jwtHelper.createToken(
    {
      id: userExist?.id,
      role: userExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expries_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  passwordData: IPasswordChange
) => {
  const user = new User();
  const userExist = await user.isUserExist(userData.id);
  if (!userExist) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User doesn't exist");
  }
  const { currentPassword, newPassword } = passwordData;
  if (
    userExist?.password &&
    !user.isPasswordMatched(currentPassword, userExist?.password)
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password isn't correct!");
  }

  const password = await bcrypt.hash(
    newPassword,
    config.bcrypt_salt_rounds as string
  );
  const updatedData = {
    password,
    needsPasswordChange: false,
  };
  const result = await User.findOneAndUpdate(
    { id: userExist.id },
    updatedData,
    { new: true }
  );
  return result;
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
};
