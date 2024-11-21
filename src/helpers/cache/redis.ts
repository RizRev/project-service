import { logger } from "~/helpers/logger";
import { connectRedis } from "~/infra/cache/redis";

const reconnectAfter = 120;
let redisClient = connectRedis();

const redisFunc = {
  init: () => {
    redisClient.on("error", (err) => {
      if (err.code === "NR_CLOSED") {
        logger("redis", new Date() + " Redis: disconnect", "warning");
        setTimeout(() => {
          redisClient = connectRedis();
        }, reconnectAfter);
      }
      logger("redis", err, "error");
    });
    redisClient.on("connect", () => {
      logger("redis.connect", "Connect success", "info");
    });
    redisClient.on("reconnecting", () => {
      logger("redis.reconnecting", "Redis is reconnecting", "info");
    });
    redisClient.on("ready", () => {
      logger("redis.ready", "Redis is ready", "info");
    });
  },

  cacheRedisGet: (key: string) => {
    return new Promise((resolve) => {
      redisClient.get(key, (err, reply) => {
        if (err) {
          resolve(null);
        }
        if (reply) {
          const nReply = reply || "";
          resolve(JSON.parse(nReply));
        } else {
          resolve(null);
        }
      });
    });
  },

  cacheRedisSet: (key: string, val: string, timeoutCache = 1800, options: any = { timeFormat: "s" }) => {
    if (timeoutCache < 5 && options.timeFormat === "s") {
      const error = new SyntaxError();
      error.message = "expireIn cannot be set less than 5";
      logger("redis", error.message, "error");
      return error;
    }
    let expire = 0;
    switch (options.timeFormat) {
      case "s":
        expire = timeoutCache * 1;
        break;
      case "m":
        expire = timeoutCache * 60;
        break;
      case "h":
        expire = timeoutCache * 60 * 60;
        break;
      case "d":
        expire = timeoutCache * 60 * 60 * 24;
        break;
      default:
        expire = timeoutCache * 1;
        break;
    }
    return new Promise((resolve) => {
      const strVal = JSON.stringify(val);
      redisClient.set(key, strVal, "EX", expire, (err, reply) => {
        if (err) {
          logger("redis", err.toString(), "error");
          resolve(null);
        } else {
          resolve(reply);
        }
      });
    });
  },

  cacheRedisDel: (key: string) => {
    return new Promise((resolve) => {
      const Inst = redisClient.del(key);
      resolve(Inst);
    });
  }
};

export { redisFunc };
