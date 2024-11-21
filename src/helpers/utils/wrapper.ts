import { Response } from "express";
export interface wrapperData {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: any;
  data?: any;
  error?: any;
}
export const wrapper = {
  response: (res: Response, result: wrapperData) => {
    res.status(result.statusCode).send({
      success: result.success,
      status_code: result.statusCode,
      message: result.message,
      meta: result.meta,
      data: result.data,
      error: result?.error
    });
  },
  responseError: (res: Response, result: wrapperData) => {
    res.status(result.statusCode).send({
      success: result.success,
      status_code: result.statusCode,
      message: result.message,
      error: result.error
    });
  }
};
