import { SortOrder } from 'mongoose';
import calculatePagination from '../../../helpers/paginationHelpers';
import { IPaginaiton } from '../../../interfaces/pagination';
import { IAcademicDepartment, IFilters } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';
import { IGenericResponses } from '../../../interfaces/response';

const createDepartment = async (
  payload: IAcademicDepartment
): Promise<IAcademicDepartment> => {
  const res = await AcademicDepartment.create(payload);
  return res;
};

const getAllDepartment = async (
  filters: IFilters,
  paginationOptions: IPaginaiton
): Promise<IGenericResponses<IAcademicDepartment[] | null>> => {
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

  const result = await AcademicDepartment.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const total = await AcademicDepartment.countDocuments();
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
  payload: IAcademicDepartment
): Promise<IAcademicDepartment | null> => {
  const res = await AcademicDepartment.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return res;
};

const getSingleDepartment = async (
  id: string
): Promise<IAcademicDepartment | null> => {
  const res = await AcademicDepartment.findById({ _id: id });
  return res;
};

const deleteDepartment = async (
  id: string
): Promise<IAcademicDepartment | null> => {
  const res = await AcademicDepartment.findOneAndRemove({ _id: id });
  return res;
};

const AcademicDepartmentService = {
  createDepartment,
  getAllDepartment,
  getSingleDepartment,
  deleteDepartment,
  updateDepartment,
};

export default AcademicDepartmentService;
