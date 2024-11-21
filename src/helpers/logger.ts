import { createLogger, format, transports } from "winston";

const newLogger = createLogger({
  format: format.combine(format.json()),
  transports: [new transports.Console()]
});
export declare type LogLevel = "error" | "info" | "warning" | "debug";
export const logger = async (context: string, message: string, level: LogLevel, description: object = {}) => {
  const obj = {
    _timestamp: new Date().toISOString(),
    context,
    level: level,
    message: message.toString(),
    ...description
  };
  newLogger.log(obj);
};
