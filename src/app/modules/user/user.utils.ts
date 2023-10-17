import { IAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

const findLastStudentId = async () => {
  const lastUser = await User.findOne({ role: 'student' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastUser?.id ? lastUser.id.substring(4) : undefined;
};

const generateStudentId = async (
  academicSemester: IAcademicSemester | null
) => {
  const currentId =
    (await findLastStudentId()) || (0).toString().padStart(5, '0');
  let incretmentedId = (parseInt(currentId as string) + 1)
    .toString()
    .padStart(5, '0');
  incretmentedId = `${academicSemester?.year.substring(2)}${
    academicSemester?.code
  }${incretmentedId}`;

  return incretmentedId;
};
const findLastFacultyId = async () => {
  const lastUser = await User.findOne({ role: 'faculty' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastUser?.id ? lastUser.id.substring(2) : undefined;
};

const generateFacultyId = async () => {
  const currentId =
    (await findLastFacultyId()) || (0).toString().padStart(5, '0');
  let incretmentedId = (parseInt(currentId as string) + 1)
    .toString()
    .padStart(5, '0');
  incretmentedId = `F-${incretmentedId}`;

  return incretmentedId;
};

const findLastAdminId = async () => {
  const lastUser = await User.findOne({ role: 'admin' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastUser?.id ? lastUser.id.substring(2) : undefined;
};

const generateAdminId = async () => {
  const currentId =
    (await findLastAdminId()) || (0).toString().padStart(5, '0');
  let incretmentedId = (parseInt(currentId as string) + 1)
    .toString()
    .padStart(5, '0');
  incretmentedId = `A-${incretmentedId}`;

  return incretmentedId;
};

export const userUtils = {
  generateStudentId,
  generateFacultyId,
  generateAdminId,
};
