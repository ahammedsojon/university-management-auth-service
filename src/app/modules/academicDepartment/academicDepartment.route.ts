import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import AcademicDepartmentValidation from './academicDepartment.validate';
import { AcademicDepartmentController } from './academicDeapartment.controller';

const router = express.Router();

router.post(
  '/create-department',
  validateRequest(
    AcademicDepartmentValidation.CreateAcademicDepartmentZodSchema
  ),
  AcademicDepartmentController.createDepartment
);
router.get('/:id', AcademicDepartmentController.getSingleDepartment);
router.get('/', AcademicDepartmentController.getAllDepartment);
router.patch(
  '/:id',
  validateRequest(
    AcademicDepartmentValidation.UpdateAcademicDepartmentZodSchema
  ),
  AcademicDepartmentController.updateDepartment
);
router.delete('/:id', AcademicDepartmentController.deleteDepartment);

export const AcademicDepartmentRoutes = router;
