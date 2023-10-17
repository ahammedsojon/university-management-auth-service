import { z } from 'zod';

const CreateManagementDepartmentZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required.',
    }),
  }),
});

const UpdateManagementDepartmentZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
  }),
});

const ManagementDepartmentValidation = {
  CreateManagementDepartmentZodSchema,
  UpdateManagementDepartmentZodSchema,
};

export default ManagementDepartmentValidation;
