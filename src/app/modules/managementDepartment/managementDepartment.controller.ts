import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import ManagementDepartmentService from './managementDepartment.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { managementDeaprtmentFilterableFields } from './managementDepartment.constant';
import paginationFields from '../../../constants/paginationFields';

const createDepartment: RequestHandler = catchAsync(async (req, res) => {
  const { ...departmentData } = req.body;
  const result = await ManagementDepartmentService.createDepartment(
    departmentData
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Management department has been created successfully!',
    data: result,
  });
});

const getAllDepartment: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, managementDeaprtmentFilterableFields);

  const paginationOptions = pick(req.query, paginationFields);
  const result = await ManagementDepartmentService.getAllDepartment(
    filters,
    paginationOptions
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Management departments retrived successfully!',
    data: result,
  });
});

const getSingleDepartment: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await ManagementDepartmentService.getSingleDepartment(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Management department retrived successfully!',
    data: result,
  });
});

const deleteDepartment: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await ManagementDepartmentService.deleteDepartment(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Management department has been deleted successfully!',
    data: result,
  });
});

const updateDepartment: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { ...ManagementData } = req.body;
  const result = await ManagementDepartmentService.updateDepartment(
    id,
    ManagementData
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Management department has been updated successfully!',
    data: result,
  });
});

export const ManagementDepartmentController = {
  createDepartment,
  getAllDepartment,
  getSingleDepartment,
  deleteDepartment,
  updateDepartment,
};
