/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";
import { INTERNAL_SERVER_ERROR } from "http-status-codes";
import { Controller, IControllerResponse } from "~/controller";
import { wrapperData, wrapper } from "~/helpers/utils/wrapper";
import { RequestWithToken } from "~/middleware/auth/verify-token";

export interface IHttpRequest {
  body: RequestWithToken["body"];
  query: any;
  params: any;
  decodedToken: RequestWithToken["decodedToken"];
  file?: any;
  files?: any;
}

export const buildExpressCallback = (controller: Controller, type = "") => {
  return async (req: RequestWithToken, res: Response) => {
    try {
      const httpRequest: IHttpRequest = {
        body: req.body,
        query: req.query,
        params: req.params,
        decodedToken: req.decodedToken
      };
      if (type == "multipart") {
        httpRequest.file = req.file;
        httpRequest.files = req.files;
      }
      const httpResponse: IControllerResponse = await controller(httpRequest);
      const responseData: wrapperData = {
        statusCode: httpResponse.statusCode || 200,
        message: httpResponse.message,
        data: httpResponse.data,
        meta: httpResponse?.meta,
        success: httpResponse.success,
        error: httpResponse?.error
      };
      wrapper.response(res, responseData);
    } catch (error) {
      res.statusCode = INTERNAL_SERVER_ERROR;
      res.json({
        success: false,
        status_code: INTERNAL_SERVER_ERROR,
        error
      });
    }
  };
};
