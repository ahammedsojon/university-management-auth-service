import { IPaginaiton } from '../../../interfaces/pagination';
import { IGenericResponses } from '../../../interfaces/response';
import calculatePagination from '../../../helpers/paginationHelpers';
import mongoose, { SortOrder } from 'mongoose';
import { IFilters, IAdmin } from './admin.interface';
import { Admin } from './admin.model';
import { adminSearchableFields } from './admin.constant';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const updateAdmin = async (
  id: string,
  payload: Partial<IAdmin>
): Promise<IAdmin | null> => {
  const { name, ...updateAdmin } = payload;

  const updateAdminData: Partial<IAdmin> = { ...updateAdmin };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin>;
      (updateAdminData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  const result = await Admin.findOneAndUpdate(
    {
      id: id,
    },
    updateAdminData,
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

const getAllAdmin = async (
  filters: IFilters,
  paginationOptions: IPaginaiton
): Promise<IGenericResponses<IAdmin[]>> => {
  const { searchParam, ...filtersData } = filters;

  const andConditions = [];
  if (searchParam) {
    andConditions.push({
      $or: adminSearchableFields.map(field => ({
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
  const result = await Admin.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const total = await Admin.countDocuments(whereCondition);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAdmin = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findOne({ id: id });
  return result;
};

const deleteAdmin = async (id: string): Promise<IAdmin | null> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const admin = await Admin.findOneAndDelete([{ id: id }], { session });
    if (!admin) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to delete admin!');
    }
    await User.deleteOne({ id: id });
    await session.commitTransaction();
    await session.endSession();
    return admin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const AdminService = {
  getAllAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
};
