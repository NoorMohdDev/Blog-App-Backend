import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addPostViews } from "../controllers/view.controllers.js";

const router = Router();

//routes

router.route("/add/:postId").get(verifyJWT,addPostViews)

export default router;