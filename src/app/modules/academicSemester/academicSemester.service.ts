import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { academicSemesterTitleCodeMapper } from './academicSemester.constant';
import { IAcademicSemester, IFilters } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';
import { IPaginaiton } from '../../../interfaces/pagination';
import { IGenericResponses } from '../../../interfaces/response';
import calculatePagination from '../../../helpers/paginationHelpers';
import { SortOrder } from 'mongoose';

const createSemester = async (
  payload: IAcademicSemester
): Promise<IAcademicSemester> => {
  if (academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Academic semester code is invalid!'
    );
  }
  const result = AcademicSemester.create(payload);
  return result;
};

const updatedSemester = async (
  id: string,
  payload: Partial<IAcademicSemester>
): Promise<IAcademicSemester | null> => {
  if (
    payload.title &&
    payload.code &&
    academicSemesterTitleCodeMapper[payload.title] !== payload.code
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Academic semester code is invalid!'
    );
  }
  const result = await AcademicSemester.findOneAndUpdate(
    {
      _id: id,
    },
    payload,
    { new: true }
  );
  return result;
};

const getSemesters = async (
  filters: IFilters,
  paginationOptions: IPaginaiton
): Promise<IGenericResponses<IAcademicSemester[]>> => {
  // console.log(filters, 22);

  const { searchParam, ...filtersData } = filters;
  const academicSemesterSearchableFields = ['title', 'code', 'year'];

  const andConditions = [];
  if (searchParam) {
    andConditions.push({
      $or: academicSemesterSearchableFields.map(field => ({
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
  const result = await AcademicSemester.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const total = await AcademicSemester.countDocuments();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingle = async (id: string): Promise<IAcademicSemester | null> => {
  const result = await AcademicSemester.findById({ _id: id });
  return result;
};

const deleteSemester = async (
  id: string
): Promise<IAcademicSemester | null> => {
  const result = await AcademicSemester.findByIdAndDelete({ _id: id });
  return result;
};

export const AcademicSemisterService = {
  createSemester,
  getSemesters,
  getSingle,
  updatedSemester,
  deleteSemester,
};
