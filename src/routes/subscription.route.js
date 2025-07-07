import { Router } from "express";
import { getUserBlogSubscribers, toggleSubscription } from "../controllers/subscription.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/t/:blogId").post( verifyJWT,toggleSubscription);
router.route("/blog-subscribers/:blogId").get( verifyJWT,getUserBlogSubscribers);

export default router;