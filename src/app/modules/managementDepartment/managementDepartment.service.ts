import { SortOrder } from 'mongoose';
import calculatePagination from '../../../helpers/paginationHelpers';
import { IPaginaiton } from '../../../interfaces/pagination';
import {
  IManagementDepartment,
  IFilters,
} from './managementDepartment.interface';
import { ManagementDepartment } from './managementDepartment.model';
import { IGenericResponses } from '../../../interfaces/response';

const createDepartment = async (
  payload: IManagementDepartment
): Promise<IManagementDepartment> => {
  const res = await ManagementDepartment.create(payload);
  return res;
};

const getAllDepartment = async (
  filters: IFilters,
  paginationOptions: IPaginaiton
): Promise<IGenericResponses<IManagementDepartment[] | null>> => {
  const { searchParam, ...filtersData } = filters;

  const andConditions = [];
  if (searchParam) {
    andConditions.push({
      $or: [
        {
          title: {
            $regex: searchParam,
            $options: 'i',
          },
        },
      ],
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

  const result = await ManagementDepartment.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const total = await ManagementDepartment.countDocuments();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateDepartment = async (
  id: string,
  payload: IManagementDepartment
): Promise<IManagementDepartment | null> => {
  const res = await ManagementDepartment.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    }
  );
  return res;
};

const getSingleDepartment = async (
  id: string
): Promise<IManagementDepartment | null> => {
  const res = await ManagementDepartment.findById({ _id: id });
  return res;
};

const deleteDepartment = async (
  id: string
): Promise<IManagementDepartment | null> => {
  const res = await ManagementDepartment.findOneAndRemove({ _id: id });
  return res;
};

const ManagementDepartmentService = {
  createDepartment,
  getAllDepartment,
  getSingleDepartment,
  deleteDepartment,
  updateDepartment,
};

export default ManagementDepartmentService;
