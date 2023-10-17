import { z } from 'zod';

const CreateAcademicDepartmentZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required.',
    }),
    academicFaculty: z.string({
      required_error: 'Academic faculty is required.',
    }),
  }),
});

const UpdateAcademicDepartmentZodSchema = z.object({
  body: z.object({
    title: z.string({}).optional(),
    academicFaculty: z.string({}).optional(),
  }),
});

const AcademicDepartmentValidation = {
  CreateAcademicDepartmentZodSchema,
  UpdateAcademicDepartmentZodSchema,
};

export default AcademicDepartmentValidation;
