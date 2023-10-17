import { IPaginaiton } from '../../../interfaces/pagination';
import { IGenericResponses } from '../../../interfaces/response';
import calculatePagination from '../../../helpers/paginationHelpers';
import mongoose, { SortOrder } from 'mongoose';
import { IFilters, IFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';
import { facultySearchableFields } from './faculty.constant';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const updateFaculty = async (
  id: string,
  payload: Partial<IFaculty>
): Promise<IFaculty | null> => {
  const { name, ...updateFaculty } = payload;

  const updateFacultyData: Partial<IFaculty> = { ...updateFaculty };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IFaculty>;
      (updateFacultyData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  const result = await Faculty.findOneAndUpdate(
    {
      id: id,
    },
    updateFacultyData,
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

const getAllFaculty = async (
  filters: IFilters,
  paginationOptions: IPaginaiton
): Promise<IGenericResponses<IFaculty[]>> => {
  const { searchParam, ...filtersData } = filters;

  const andConditions = [];
  if (searchParam) {
    andConditions.push({
      $or: facultySearchableFields.map(field => ({
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
  const result = await Faculty.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const total = await Faculty.countDocuments(whereCondition);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getFaculty = async (id: string): Promise<IFaculty | null> => {
  const result = await Faculty.findOne({ id: id });
  return result;
};

const deleteFaculty = async (id: string): Promise<IFaculty | null> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const faculty = await Faculty.findOneAndDelete({ id }, { session });
    if (!faculty) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to delete faculty');
    }
    await User.deleteOne({ id });
    await session.commitTransaction();
    await session.endSession();
    return faculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const FacultyService = {
  getAllFaculty,
  getFaculty,
  updateFaculty,
  deleteFaculty,
};
