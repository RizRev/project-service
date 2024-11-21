import { Router } from "express";

import user from "./user";
import kost from "./kost";
import room from "./room";

const router = Router();

router.use("/auth", user);
router.use("/kost", kost);
router.use("/room", room);

export default router;
