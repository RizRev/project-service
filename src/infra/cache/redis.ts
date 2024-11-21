import redis, { RetryStrategyOptions } from "redis";
import { globalConfig } from "../../config/environment";
import { logger } from "../../helpers/logger";

const redisConfig = globalConfig("/redisConfig");

const connectRedis = () => {
  return redis.createClient({
    host: redisConfig.host,
    port: redisConfig.port,
    auth_pass: redisConfig.password,
    retry_strategy: (options: RetryStrategyOptions) => {
      if (options.error && options.error.code === "ECONNREFUSED") {
        logger("redis", "The server refused the connection", "error");
      }
      if (options.total_retry_time > 10000 * 60 * 60) {
        logger("redis", "Retry time exhausted", "error");
        return new Error("Retry time exhausted");
      }
      if (options.attempt >= 100) {
        logger("redis", "Retry attempt exhausted", "error");
        return new Error("Retry time exhausted");
      }
      return Math.min(options.attempt * 100, 3000);
    }
  });
};

export { connectRedis };
