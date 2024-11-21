import { Router } from "express";
import { buildExpressCallback } from "~/helpers/express-callback";
import user from "~/controller/user";

const router = Router();

router.post("/register", buildExpressCallback(user.createUser));
router.post("/login", buildExpressCallback(user.loginUser));
router.post("/changePassword", buildExpressCallback(user.changePassword));

export default router;
