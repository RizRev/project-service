import { IHttpRequest } from "~/helpers/express-callback";
import { IControllerResponse } from ".";
import { OK, INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status-codes";
import kostRepo from "~/database/kost";
import { logger } from "~/helpers/logger";

const context = "kostController";

const createKost = async (request: Partial<IHttpRequest>): Promise<IControllerResponse> => {
  const ctx = `${context}.createKost`;
  const { body } = request;
  try {
    logger(ctx, body, "info");
    await kostRepo.createKost(body);
    return {
      success: true,
      statusCode: OK,
      message: "Kost created successfully",
      data: body
    };
  } catch (error) {
    logger(ctx, `${request}`, "error", error.stoString());
    return {
      success: false,
      statusCode: INTERNAL_SERVER_ERROR,
      message: "Error creating kost",
      error
    };
  }
};

export default {
  createKost
};
