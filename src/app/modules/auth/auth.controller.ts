import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { AuthService } from './auth.service';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import config from '../../../config';
import { IUser } from '../user/user.interface';

const loginUser: RequestHandler = catchAsync(async (req, res) => {
  const { ...loginData } = req.body;

  const result = await AuthService.loginUser(loginData);
  const { refreshToken, ...others } = result;
  const cookieOption = {
    secure: config.env === 'production',
    httpOnley: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOption);
  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: others,
  });
});

const refreshToken: RequestHandler = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);
  const cookieOption = {
    secure: config.env === 'production',
    httpOnley: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOption);
  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: result,
  });
});

const changePassword: RequestHandler = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;
  const user = req.user;
  const result = await AuthService.changePassword(user, passwordData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully!',
    data: result,
  });
});

export const AuthController = {
  loginUser,
  changePassword,
  refreshToken,
};
