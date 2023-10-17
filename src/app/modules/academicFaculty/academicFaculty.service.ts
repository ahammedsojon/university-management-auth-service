import { SortOrder } from 'mongoose';
import calculatePagination from '../../../helpers/paginationHelpers';
import { IPaginaiton } from '../../../interfaces/pagination';
import AcademicFaculty from './academicFaculty.model';
import { IAcademicFaculty, IFilters } from './academicFacutly.interface';
import { IGenericResponses } from '../../../interfaces/response';

const getFaculties = async (
  filters: IFilters,
  paginationOptions: IPaginaiton
): Promise<IGenericResponses<IAcademicFaculty[] | null>> => {
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
  const result = await AcademicFaculty.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const total = await AcademicFaculty.countDocuments();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getFaculty = async (id: string): Promise<IAcademicFaculty | null> => {
  const res = await AcademicFaculty.findById({ _id: id });
  return res;
};

const createFaculty = async (
  payload: IAcademicFaculty
): Promise<IAcademicFaculty> => {
  const res = await AcademicFaculty.create(payload);
  return res;
};

const updateFaculty = async (
  id: string,
  payload: IAcademicFaculty
): Promise<IAcademicFaculty | null> => {
  const res = await AcademicFaculty.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return res;
};

const deleteFaculty = async (id: string): Promise<IAcademicFaculty | null> => {
  const res = await AcademicFaculty.findOneAndRemove({ _id: id });
  return res;
};

export const AcademicFacultyService = {
  createFaculty,
  getFaculties,
  updateFaculty,
  deleteFaculty,
  getFaculty,
};
