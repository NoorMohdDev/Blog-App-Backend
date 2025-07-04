import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deletePost,
  getAllPosts,
  getPostById,
  publishAPost,
  togglePublishStatus,
  updateFeatureImage,
  updatePost,
} from "../controllers/post.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/all").get(verifyJWT, getAllPosts);
router.route("/p/:postId").get(verifyJWT, getPostById);
router.route("/update/:postId").patch(verifyJWT, updatePost);
router.route("/delete/:postId").delete(verifyJWT, deletePost);
router.route("/update-status/:postId").patch(verifyJWT, togglePublishStatus);
router
  .route("/update-feature-image/:postId")
  .patch(verifyJWT, upload.single("featureImage"), updateFeatureImage);
router
  .route("/add")
  .post(verifyJWT, upload.single("featureImage"), publishAPost);

export default router;
