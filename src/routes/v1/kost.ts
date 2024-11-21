import { Router } from "express";
import { buildExpressCallback } from "~/helpers/express-callback";
import kost from "~/controller/kost";

const router = Router();

router.post("/create", buildExpressCallback(kost.createKost));

export default router;
