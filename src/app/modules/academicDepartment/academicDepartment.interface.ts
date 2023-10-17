import { Model, Types } from 'mongoose';
import { IAcademicFaculty } from '../academicFaculty/academicFacutly.interface';

export type IAcademicDepartment = {
  title: string;
  academicFaculty: Types.ObjectId | IAcademicFaculty;
};

export type AcademicDepartmentModel = Model<
  IAcademicDepartment,
  Record<string, unknown>
>;

export type IFilters = {
  searchParam: string;
};
