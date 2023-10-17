import { IPaginaiton } from '../../../interfaces/pagination';
import { IGenericResponses } from '../../../interfaces/response';
import calculatePagination from '../../../helpers/paginationHelpers';
import mongoose, { SortOrder } from 'mongoose';
import { IFilters, IStudent } from './student.interface';
import { Student } from './student.model';
import { studetSearchableFields } from './student.constant';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const updateStudent = async (
  id: string,
  payload: Partial<IStudent>
): Promise<IStudent | null> => {
  const { name, guardian, localGuardian, ...updateStudent } = payload;

  const updateStudentData: Partial<IStudent> = { ...updateStudent };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IStudent>;
      (updateStudentData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  if (guardian && Object.keys(guardian).length > 0) {
    Object.keys(guardian).forEach(key => {
      const guardianKey = `guardian.${key}` as keyof Partial<IStudent>;
      (updateStudentData as any)[guardianKey] =
        guardian[key as keyof typeof guardian];
    });
  }

  if (localGuardian && Object.keys(localGuardian).length > 0) {
    Object.keys(localGuardian).forEach(key => {
      const localGuardianKey =
        `localGuardian.${key}` as keyof Partial<IStudent>;
      (updateStudentData as any)[localGuardianKey] =
        localGuardian[key as keyof typeof localGuardian];
    });
  }
  const result = await Student.findOneAndUpdate(
    {
      id: id,
    },
    updateStudentData,
    { new: true }
  );
  if (result) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Api error failed to update student.'
    );
  }
};

const getAllStudent = async (
  filters: IFilters,
  paginationOptions: IPaginaiton
): Promise<IGenericResponses<IStudent[]>> => {
  const { searchParam, ...filtersData } = filters;

  const andConditions = [];
  if (searchParam) {
    andConditions.push({
      $or: studetSearchableFields.map(field => ({
        [field]: {
          $regex: searchParam,
          $options: 'i',
        },
      })),
    });
  }
  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const sortCondition: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};
  const result = await Student.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const total = await Student.countDocuments(whereCondition);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getStudent = async (id: string): Promise<IStudent | null> => {
  const result = await Student.findOne({ id: id });
  return result;
};

const deleteStudent = async (id: string): Promise<IStudent | null> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const student = await Student.findOneAndDelete({ id }, { session });
    if (!student) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to delete student!');
    }
    await User.deleteOne({ id: id });
    await session.commitTransaction();
    await session.endSession();
    return student;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const StudentService = {
  getAllStudent,
  getStudent,
  updateStudent,
  deleteStudent,
};
