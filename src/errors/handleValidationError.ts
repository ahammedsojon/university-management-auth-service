import mongoose from 'mongoose';

import { IGenericErrorMessages } from '../interfaces/error';
import { IGenericErrorResponses } from '../interfaces/response';

const handleValidationError = (
  error: mongoose.Error.ValidationError
): IGenericErrorResponses => {
  const errors: IGenericErrorMessages[] = Object.values(error.errors).map(
    (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: el?.path,
        message: el?.message,
      };
    }
  );
  return {
    statusCode: 400,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleValidationError;
