import { Request, Response, NextFunction } from "express";
import { BAD_REQUEST } from "http-status-codes";
import { wrapper, wrapperData } from "~/helpers/utils/wrapper";
import { constructor } from "~/helpers/utils/constructor";

export const validator = (schema: any, payloadType = "body") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let payload: any;
    if (payloadType === "body") {
      payload = req.body;
    } else if (payloadType === "params") {
      payload = req.params;
    } else {
      payload = req.query;
    }

    const check = schema.validate(payload);
    if (check.error) {
      const result: wrapperData = {
        success: false,
        statusCode: BAD_REQUEST,
        message: constructor.extractJoiMessage(check.error),
        error: check.error
      };
      return wrapper.responseError(res, result);
    }

    next();
  };
};
