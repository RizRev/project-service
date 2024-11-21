import { server } from "~/app";
import { redisFunc } from "~/helpers/cache/redis";
import { pgInit } from "~/infra/database/pgsql";

redisFunc.init();
pgInit();

server.start();
