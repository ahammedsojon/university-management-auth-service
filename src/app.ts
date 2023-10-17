import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './middlewares/globalErrorHandler';
import router from './app/routes/routes';
import httpStatus from 'http-status';
import cookieParser from 'cookie-parser';
import { userUtils } from './app/modules/user/user.utils';
const app: Application = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/', router);

// global error handler
app.use(globalErrorHandler);

const academicSemester = {
  year: '2025',
  code: '01',
};

const generateId = async () => {
  await userUtils.generateFacultyId(academicSemester);
};
generateId();

// not found error handler
app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
});
export default app;
