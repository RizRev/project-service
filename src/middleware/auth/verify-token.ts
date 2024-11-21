import { Request, Response, NextFunction } from "express";
import { globalConfig } from "~/config/environment";
import { FORBIDDEN, UNAUTHORIZED } from "http-status-codes";
import { wrapper, wrapperData } from "~/helpers/utils/wrapper";
import { redisFunc } from "~/helpers/cache/redis";
import { decrypt, checkStatus } from "~/helpers/auth/helper";
import Jwt, { SignOptions } from "jsonwebtoken";

export interface RequestWithToken extends Request {
  decodedToken?: any;
}

const getToken = (headerAuth: string) => {
  if (headerAuth && headerAuth.includes("Bearer")) {
    const parted = headerAuth.split(" ");
    if (parted.length === 2) {
      return parted[1];
    }
  }
  return undefined;
};

export const verifyScope = (token: any, required: string[]) => {
  let status;
  if (required.indexOf(token.context.user.role.nama) > -1) {
    status = true;
  } else {
    status = false;
  }
  return status;
};

export const verifyToken = (scope: string[]) => {
  return async (req: RequestWithToken, res: Response, next: NextFunction) => {
    const jwtKey = globalConfig("/jwtKey");
    const verifyOptions: SignOptions = {
      algorithm: "HS512",
      expiresIn: "1d"
    };

    const headerAuth = req.header("Authorization") || "";
    const encryptedtoken = getToken(headerAuth);
    if (!encryptedtoken) {
      const result: wrapperData = {
        success: false,
        statusCode: FORBIDDEN,
        message: "Invalid token"
      };
      return wrapper.response(res, result);
    }

    const tokenName = `expired-${encryptedtoken}`;
    const isExist = await redisFunc.cacheRedisGet(tokenName);
    if (isExist) {
      const result: wrapperData = {
        success: false,
        statusCode: UNAUTHORIZED,
        message: "Access token expired!"
      };
      return wrapper.response(res, result);
    }

    let decryptedToken;
    try {
      decryptedToken = await decrypt(encryptedtoken);
    } catch (e) {
      const result: wrapperData = {
        success: false,
        statusCode: UNAUTHORIZED,
        message: "Invalid token!"
      };
      return wrapper.response(res, result);
    }

    let decodedToken: any;
    try {
      decodedToken = await Jwt.verify(decryptedToken, jwtKey, verifyOptions);
    } catch (error) {
      if (error instanceof Jwt.TokenExpiredError) {
        const result: wrapperData = {
          success: false,
          statusCode: UNAUTHORIZED,
          message: "Access token expired!"
        };
        return wrapper.response(res, result);
      }
      const result: wrapperData = {
        success: false,
        statusCode: UNAUTHORIZED,
        message: "Invalid token!"
      };
      return wrapper.response(res, result);
    }

    if (decodedToken.context.type !== "access_token") {
      const result: wrapperData = {
        success: false,
        statusCode: UNAUTHORIZED,
        message: "Invalid token!"
      };
      return wrapper.response(res, result);
    }

    const checkStatusRes = await checkStatus(decodedToken.context.user.id);
    if (!checkStatusRes) {
      const result: wrapperData = {
        success: false,
        statusCode: UNAUTHORIZED,
        message: "Account not found"
      };
      return wrapper.response(res, result);
    }

    req.decodedToken = decodedToken;
    next();
  };
};
