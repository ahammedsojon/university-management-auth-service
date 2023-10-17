import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import ManagementDepartmentValidation from './managementDepartment.validation';
import { ManagementDepartmentController } from './managementDepartment.controller';

const router = express.Router();

router.post(
  '/create-management',
  validateRequest(
    ManagementDepartmentValidation.CreateManagementDepartmentZodSchema
  ),
  ManagementDepartmentController.createDepartment
);
router.get('/:id', ManagementDepartmentController.getSingleDepartment);
router.get('/', ManagementDepartmentController.getAllDepartment);
router.patch(
  '/:id',
  validateRequest(
    ManagementDepartmentValidation.UpdateManagementDepartmentZodSchema
  ),
  ManagementDepartmentController.updateDepartment
);
router.delete('/:id', ManagementDepartmentController.deleteDepartment);

export const ManagementDepartmentRoutes = router;
