import { Router } from "express";
import {
  addComment,
  deleteComment,
  getPostComments,
  updateComment,
} from "../controllers/comment.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// secure routes
router.route("/all/:postId").get(verifyJWT, getPostComments);
router.route("/add/:postId").post(verifyJWT, addComment);
router.route("/update").patch(verifyJWT, updateComment);
router.route("/delete").delete(verifyJWT, deleteComment);

export default router;
