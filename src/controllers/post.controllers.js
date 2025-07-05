import mongoose, { isValidObjectId } from "mongoose";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllPosts = asyncHandler(async (req, res) => {
  //   const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all post based on query, sort, pagination
  const { userId } = req.query;

  const getPosts = await Post.aggregate([
    {
      $match: {
        authorId: new mongoose.Types.ObjectId(userId),
      },
    },
  ]);

  if (!getPosts) {
    throw new ApiError(500, "Error while fetching all posts");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getPosts, "Posts fetched successfully"));

});

const publishAPost = asyncHandler(async (req, res) => {
  const { title, description, body, slug, metaDescription, status, authorId } = req.body;
  const featureImageLocalFilePath  = req?.file.path;
  // TODO: get post, create post

  if (
    [body, slug].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "Post Body or slug or feature image is missing");
  }

  const featureImage = await uploadOnCloudinary(featureImageLocalFilePath);

  if (!featureImage?.url) {
    throw new ApiError(400, "Error while uploading feature image");
  }

  const createPost = await Post.create({
    title: title.trim(),
    body: body.trim(),
    description: description.trim(),
    metaDescription: metaDescription,
    status: status,
    slug: slug.trim(),
    featureImage: featureImage?.url || "",
    authorId: authorId,
  });

  if (!createPost) {
    throw new ApiError(500, "Something went wrong while creating post");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createPost, "Post created successfully"));
});

const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  //TODO: get post by id

  const getPost = await Post.findById(postId);

  if (!getPost) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, getPost, "Post fetched successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
  const { title, description, body, slug, metaDescription } = req.body;
  const { postId } = req.params;
  //TODO: update post details like title, description, thumbnail
  if ([body, slug].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Post Body or slug is missing");
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        title: title,
        body: body,
        description: description,
        slug: slug,
        metaDescription: metaDescription,
      },
    },
    { new: true }
  );

  if (!updatedPost) {
    throw new ApiError(500, "Something went wrong while updating post");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatePost, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  //TODO: delete post

  const deletedPost = await Post.findByIdAndDelete(postId);

  if (!deletedPost) {
    throw new ApiError(500, "Something went wrong while deleting post");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { postStatus } = req.body;

  const changeStatus = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        status: postStatus,
      },
    },
    {
      new: true,
    }
  );

  if (!changeStatus) {
    throw new ApiError(500, "Something went wrong while updating post status");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, changeStatus.status, "Status changed successfully")
    );
});

const updateFeatureImage = asyncHandler(async (req, res) => {
  const localFeatureImagePath = req.file?.path;
  const { postId } = req.params;

  if (!localFeatureImagePath) {
    throw new ApiError(400, "Feature image file is missing");
  }

  const featureImage = await uploadOnCloudinary(localFeatureImagePath);

  if (!featureImage.url) {
    throw new ApiError(400, "Error while uploading feature image");
  }

  const user = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        featureImage: featureImage.url,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Update feature image successfully"));
});
export {
  getAllPosts,
  publishAPost,
  getPostById,
  updatePost,
  deletePost,
  togglePublishStatus,
  updateFeatureImage,
};
