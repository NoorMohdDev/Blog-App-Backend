import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addPostViews, getPostViews } from "../controllers/view.controllers.js";

const router = Router();

//routes

router.route("/add/:postId").get(verifyJWT, addPostViews)
router.route("/get-post-views/:postId").get(verifyJWT, getPostViews)

export default router;