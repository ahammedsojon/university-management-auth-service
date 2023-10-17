import mongoose from 'mongoose';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { IStudent } from '../student/student.interface';
import { IUser } from './user.interface';
import { User } from './user.model';
import { userUtils } from './user.utils';
import { Student } from '../student/student.model';
import httpStatus from 'http-status';
import { IFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';

const createStudentToDB = async (
  student: IStudent,
  user: IUser
): Promise<IUser | null> => {
  user.password = (user.password || config.default_password) as string;
  user.role = 'student';
  let userData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const academicSemesterData = await AcademicSemester.findById(
      student.academicSemester
    );
    const id = await userUtils.generateStudentId(academicSemesterData);
    user.id = id;
    student.id = id;
    const createStudent = await Student.create([student], { session });
    if (!createStudent.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create faculty.');
    }

    user.student = createStudent[0]._id;

    const createUser = await User.create([user], { session });

    if (!createUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user.');
    }
    userData = createUser[0];
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    session.endSession();
    throw error;
  }
  if (userData) {
    userData = await User.findOne({ id: userData.id }).populate({
      path: 'faculty',
      populate: [
        {
          path: 'academicFaculty',
        },
        {
          path: 'academicDepartment',
        },
      ],
    });
  }
  return userData;
};

const createFacultyToDB = async (
  faculty: IFaculty,
  user: IUser
): Promise<IUser | null> => {
  user.password = (user.password || config.default_password) as string;
  user.role = 'faculty';
  let userData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const id = await userUtils.generateFacultyId();
    user.id = id;
    faculty.id = id;
    const createFaculty = await Faculty.create([faculty], { session });
    if (!createFaculty.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create faculty.');
    }

    user.faculty = createFaculty[0]._id;

    const createUser = await User.create([user], { session });

    if (!createUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user.');
    }
    userData = createUser[0];
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    session.endSession();
    throw error;
  }
  if (userData) {
    userData = await User.findOne({ id: userData.id }).populate({
      path: 'faculty',
      populate: [
        {
          path: 'academicFaculty',
        },
        {
          path: 'academicDepartment',
        },
      ],
    });
  }
  return userData;
};

const createAdminToDB = async (
  admin: IAdmin,
  user: IUser
): Promise<IUser | null> => {
  user.password = (user.password || config.default_password) as string;
  user.role = 'admin';
  let userData = null;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const id = await userUtils.generateAdminId();
    user.id = id;
    admin.id = id;
    const createAdmin = await Admin.create([admin], { session });
    if (!createAdmin.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin.');
    }

    user.admin = createAdmin[0]._id;

    const createUser = await User.create([user], { session });

    if (!createUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin.');
    }
    userData = createUser[0];
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    session.endSession();
    throw error;
  }
  if (userData) {
    userData = await User.findOne({ id: userData.id }).populate({
      path: 'admin',
      populate: [
        {
          path: 'managementDepartment',
        },
      ],
    });
  }
  return userData;
};

export const UserService = {
  createStudentToDB,
  createFacultyToDB,
  createAdminToDB,
};
