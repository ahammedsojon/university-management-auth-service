import express from 'express';
import { FacultyController } from './faculty.controller';
import validateRequest from '../../../middlewares/validateRequest';
import { FacultyValidation } from './faculty.validation';
const router = express.Router();

router.get('/:id', FacultyController.getFaculty);
router.get('/', FacultyController.getAllFacluty);
router.patch(
  '/:id',
  validateRequest(FacultyValidation.updateFacultyZodSchema),
  FacultyController.updateFaculty
);
router.delete('/:id', FacultyController.deleteFacutly);

export const FacultyRoutes = router;
