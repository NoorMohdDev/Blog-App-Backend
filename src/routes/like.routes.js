import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  togglePostLike,
  toggleCommentLike,
  getLikedPosts,
  getLikedComments,
} from "../controllers/like.contollers.js";

const router = Router();

//secure routes

router.route("/p/:postId").post(verifyJWT, togglePostLike);
router.route("/c/:commentId").post(verifyJWT, toggleCommentLike);
router.route("/post-likes").get(verifyJWT, getLikedPosts);
router.route("/comment-likes").get(verifyJWT, getLikedComments);

export default router;