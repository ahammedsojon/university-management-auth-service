import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { academicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyController } from './academicFaculty.controller';
const router = express.Router();

router.get('/:id', AcademicFacultyController.getFaculty);

router.get('/', AcademicFacultyController.getFaculties);

router.post(
  '/create-faculty',
  validateRequest(academicFacultyValidation.updateAcademicFacultyZodSchema),
  AcademicFacultyController.createFaculty
);

router.patch(
  '/:id',
  validateRequest(academicFacultyValidation.updateAcademicFacultyZodSchema),
  AcademicFacultyController.updateFaculty
);

router.delete('/:id', AcademicFacultyController.deleteFaculty);

export const AcademicFacultyRoutes = router;
