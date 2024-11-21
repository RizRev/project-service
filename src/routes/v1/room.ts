import { Router } from "express";
import { buildExpressCallback } from "~/helpers/express-callback";
import room from "~/controller/room";

const router = Router();

router.post("/create", buildExpressCallback(room.createRoom));

export default router;
