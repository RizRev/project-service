import { globalConfig } from "~/config/environment";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import apiV1 from "~/routes/v1";
import { logger } from "~/helpers/logger";

class Server {
  [x: string]: any;
  ctx: string;
  envPort = globalConfig("/port");
  defaultPort = 3000;

  constructor() {
    this.ctx = "server";
  }

  app = express();
  port = this.envPort || this.defaultPort;

  applyLogger() {
    this.app.use(
      morgan(
        (tokens, req, res) => {
          const status: number = parseInt(tokens.status(req, res)) || 500;
          const color =
            status >= 500
              ? `\x1b[31m${status}\x1b[0m`
              : status >= 400
              ? `\x1b[33m${status}\x1b[0m`
              : status >= 300
              ? `\x1b[36m${status}\x1b[0m`
              : status >= 200
              ? `\x1b[32m${status}\x1b[0m`
              : `\x1b[0m${status}\x1b[0m`;
          return [
            `[${new Date().toISOString()}]`,
            tokens.method(req, res),
            tokens.url(req, res),
            color,
            tokens["response-time"](req, res),
            "ms",
            "-",
            tokens.res(req, res, "content-length")
          ].join(" ");
        },
        {
          skip: (_req, res) => {
            if (process.env.NODE_ENV === "production") {
              return res.statusCode < 400;
            }
            return false;
          }
        }
      )
    );
  }

  applyMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());

    // Base route
    this.app.get("/", (_req, res) => {
      res.status(200).send({
        success: true,
        data: "BE Pets Care",
        message: "This service is running properly",
        code: 200
      });
    });

    // API Versioning
    this.app.use("/api/v1", apiV1);

    // Default Route 404
    this.app.use(async (_req, res) => {
      res.status(404).send({
        success: false,
        data: "",
        message: "Path not found",
        code: 404
      });
    });
  }

  start() {
    this.applyLogger();
    this.applyMiddlewares();
    this.app.listen(this.port, async () => {
      const ctx = `${this.ctx}.start`;
      logger(ctx, `listening to port:${this.port}`, "info");
    });
  }
}

export const server = new Server();
