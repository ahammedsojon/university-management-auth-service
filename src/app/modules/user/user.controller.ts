import { RequestHandler } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IUser } from './user.interface';

// const getUsers: RequestHandler = async (req, res) => {
//   res.status(200).json({
//     msg: 'Welcome to uinversity!',
//   })
// }

const getUsers: RequestHandler = (req, res) => {
  res.status(200).json({
    msg: 'Welcome to users dashboard',
  });
};

const createUser: RequestHandler = catchAsync(async (req, res, next) => {
  const { user } = req.body;
  const result = await UserService.createUserToDB(user);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User has been created successfully!',
    data: result,
  });
  next();
});

export const UserController = {
  getUsers,
  createUser,
};
