import { Model, Types } from 'mongoose';
import { IStudent } from '../student/student.interface';
import { IFaculty } from '../faculty/faculty.interface';
import { IAdmin } from '../admin/admin.interface';

export type IUser = {
  id: string;
  role: string;
  password: string;
  needsPasswordChange: true | false;
  passwordChangedAt?: Date;
  student?: Types.ObjectId | IStudent;
  faculty?: Types.ObjectId | IFaculty;
  admin?: Types.ObjectId | IAdmin;
};

export interface IUserMethods {
  isUserExist(
    id: string
  ): Promise<Pick<
    IUser,
    'id' | 'role' | 'password' | 'needsPasswordChange'
  > | null>;
  isPasswordMatched(
    givenPassword: string,
    savePasswrod: string
  ): Promise<boolean>;
}

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
