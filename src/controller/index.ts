import { IHttpRequest } from "~/helpers/express-callback";

export interface IControllerResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: any;
  error?: any;
  meta?: any;
}

export type Controller = (request: Partial<IHttpRequest>) => Promise<IControllerResponse>;
