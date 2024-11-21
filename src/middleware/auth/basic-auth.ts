import { Request, Response, NextFunction } from "express";
import { FORBIDDEN } from "http-status-codes";
import { logger } from "~/helpers/logger";

const context = "middleware";

export const verifyBasic = () => {
  const ctx = `${context}.verifyBasic`;

  return async (req: Request, res: Response, next: NextFunction) => {
    let basic, uid, secret;
    try {
      const authHeader = req.header("Authorization") || "";
      basic = authHeader.split(" ")[1];
      uid = Buffer.from(basic, "base64").toString("ascii").split(":")[0];
      secret = Buffer.from(basic, "base64").toString("ascii").split(":")[1];
    } catch (e) {
      logger(ctx, "error verify basic", "error", {
        error: e
      });
      res.statusCode = FORBIDDEN;
      res.json({
        success: false,
        status_code: FORBIDDEN,
        message: "Invalid Basic Auth"
      });
      return;
    }

    if (uid !== process.env.BASIC_USER || secret !== process.env.BASIC_PASS) {
      res.statusCode = FORBIDDEN;
      res.json({
        success: false,
        status_code: FORBIDDEN,
        message: "Invalid Basic Auth"
      });
      return;
    }

    next();
  };
};
