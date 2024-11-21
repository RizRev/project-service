import "reflect-metadata";
import { DataSource } from "typeorm";
import { globalConfig } from "~/config/environment";
import { logger } from "~/helpers/logger";
import { join } from "path";

const pgsqlConfig = globalConfig("/pgsqlConfig");
const redisConfig = globalConfig("/redisConfig");
const appDataSource = new DataSource({
  type: "postgres",
  host: pgsqlConfig.host,
  port: pgsqlConfig.port,
  username: pgsqlConfig.user,
  password: pgsqlConfig.password,
  database: pgsqlConfig.database,
  synchronize: true,
  logging: true,
  entities: [join(__dirname, "/../../model/*.{ts,js}")],
  connectTimeoutMS: 10000,
  cache: {
    type: "redis",
    options: {
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password
    }
  },
  extra: {
    max: 10
  }
});

const pgInit = async (): Promise<void> => {
  appDataSource
    .initialize()
    .then(() => {
      logger("pgSql.connect", `pgSql connection successfully initialized!`, "info");
    })
    .catch((err) => {
      logger("pgSql.connect", `pgSql error during initialization`, "error", {
        err: err.toString()
      });
      process.exit(1);
    });
};

export { appDataSource, pgInit };
