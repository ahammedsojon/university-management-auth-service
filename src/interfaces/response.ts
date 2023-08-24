import { IGenericErrorMessages } from './error';

export type IGenericResponses<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export type IGenericErrorResponses = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessages[];
};
