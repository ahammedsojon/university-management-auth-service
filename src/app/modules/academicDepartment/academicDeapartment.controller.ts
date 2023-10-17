import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import AcademicDepartmentService from './academicDepartment.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { academicDeaprtmentFilterableFields } from './academicDepartment.constant';
import paginationFields from '../../../constants/paginationFields';

const createDepartment: RequestHandler = catchAsync(async (req, res) => {
  const { ...departmentData } = req.body;
  const result = await AcademicDepartmentService.createDepartment(
    departmentData
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic department has been created successfully!',
    data: result,
  });
});

const getAllDepartment: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, academicDeaprtmentFilterableFields);

  const paginationOptions = pick(req.query, paginationFields);
  const result = await AcademicDepartmentService.getAllDepartment(
    filters,
    paginationOptions
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic departments retrived successfully!',
    data: result,
  });
});

const getSingleDepartment: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AcademicDepartmentService.getSingleDepartment(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic department retrived successfully!',
    data: result,
  });
});

const deleteDepartment: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AcademicDepartmentService.deleteDepartment(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic department has been deleted successfully!',
    data: result,
  });
});

const updateDepartment: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { ...academicData } = req.body;
  const result = await AcademicDepartmentService.updateDepartment(
    id,
    academicData
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic department has been updated successfully!',
    data: result,
  });
});

export const AcademicDepartmentController = {
  createDepartment,
  getAllDepartment,
  getSingleDepartment,
  deleteDepartment,
  updateDepartment,
};
