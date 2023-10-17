import { Model, Types } from 'mongoose';
import { IAcademicFaculty } from '../academicFaculty/academicFacutly.interface';
import { IAcademicDepartment } from '../academicDepartment/academicDepartment.interface';

export type UserName = {
  firstName: string;
  lastName: string;
  middleName: string;
};

export type IFaculty = {
  id: string;
  name: UserName; //embedded object
  gender: 'male' | 'female';
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  designation: string;
  academicFaculty: Types.ObjectId | IAcademicFaculty; // reference _id
  academicDepartment: Types.ObjectId | IAcademicDepartment; // // reference _id
  profileImage?: string;
};
export type FacultyModel = Model<IFaculty, Record<string, unknown>>;

export type IFilters = {
  searchParam: string;
  id?: string;
  email?: string;
  contactNo?: string;
  bloodGroup?: string;
};
