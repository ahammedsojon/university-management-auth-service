import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../../middlewares/validateRequest';
import userValidation from './user.validation';

const router = express.Router();

router.get('/', UserController.getUsers);
router.post(
  '/create-user',
  validateRequest(userValidation),
  UserController.createUser
);

export const UserRoutes = router;
