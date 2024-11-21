import { IHttpRequest } from "~/helpers/express-callback";
import { IControllerResponse } from ".";
import { OK, INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status-codes";
import userRepo from "~/database/user";
import { v4 as uuidv4 } from "uuid";
import { logger } from "~/helpers/logger";

const context = "userController";

const createUser = async (request: Partial<IHttpRequest>): Promise<IControllerResponse> => {
  const ctx = `${context}.createUser`;
  const { body } = request;
  try {
    logger(ctx, body, "info");
    const data = {
      ...body,
      id: uuidv4()
    };
    await userRepo.createUser(data);
    return {
      success: true,
      statusCode: OK,
      message: "User created successfully",
      data: data
    };
  } catch (error) {
    logger(ctx, `${request}`, "error", error.stoString());
    return {
      success: false,
      statusCode: INTERNAL_SERVER_ERROR,
      message: "Error creating user",
      error
    };
  }
};

const loginUser = async (request: Partial<IHttpRequest>): Promise<IControllerResponse> => {
  const ctx = `${context}.login`;
  const { body } = request;
  try {
    logger(ctx, body, "info");
    const result = await userRepo.findUser(body.email);
    if (!result) {
      return {
        success: false,
        statusCode: NOT_FOUND,
        message: "User not found",
        error: "User not found"
      };
    } else if (result.password !== body.password) {
      return {
        success: false,
        statusCode: INTERNAL_SERVER_ERROR,
        message: "Incorrect password",
        error: "Incorrect password"
      };
    }
    return {
      success: true,
      statusCode: OK,
      message: "User logged in successfully",
      data: body
    };
  } catch (error) {
    logger(ctx, `${request}`, "error", error.stoString());
    return {
      success: false,
      statusCode: INTERNAL_SERVER_ERROR,
      message: "Error logging in user",
      error
    };
  }
};

const changePassword = async (request: Partial<IHttpRequest>): Promise<IControllerResponse> => {
  const ctx = `${context}.changePassword`;
  const { body } = request;
  try {
    return {
      success: true,
      statusCode: OK,
      message: "Password changed successfully",
      data: body
    };
  } catch (error) {
    return {
      success: false,
      statusCode: INTERNAL_SERVER_ERROR,
      message: "Error changing password",
      error
    };
  }
};

export default {
  createUser,
  loginUser,
  changePassword
};
