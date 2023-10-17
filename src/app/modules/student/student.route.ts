import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../../middlewares/validateRequest';
import { StudentValidation } from './student.validation';
const router = express.Router();

router.get('/:id', StudentController.getStudent);
router.get('/', StudentController.getAllStudent);
router.patch(
  '/:id',
  validateRequest(StudentValidation.updateStudentZodSchema),
  StudentController.updateStudent
);
router.delete('/:id', StudentController.deleteStudent);

export const StudentRoutes = router;
