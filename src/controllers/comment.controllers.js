import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

const getPostComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a post
  const { postId } = req.params;
  // const { page = 1, limit = 10 } = req.query;

  const comments = await Comment.aggregate([
    {
      $match: {
        postId: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $lookup:{
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "commentBy",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      }
    },
    {
      $addFields: {
        commentBy: {
          $first: "$commentBy",
        },
      },
    },
    {
      $project:{
        comment: 1,
        commentBy : 1
      }
    },
  ]);

  if (!comments) {
    throw new ApiError(400, "Error while fetching comments");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a post

  const { comment } = req.body;
  const { postId } = req.params;

  if (comment === ("" || null)) {
    throw new ApiError(400, "Fields cannot be blank or null");
  }

  const newComment = await Comment.create({
    userId: req.user._id,
    postId: postId,
    comment: comment?.trim(),
  });

  if (!newComment) {
    throw new ApiError(500, "Something went wrong while adding comment");
  }

  const createdComment = await Comment.findById(newComment._id).select(
    "-postId -userId"
  );

  return res
    .status(201)
    .json(new ApiResponse(200, createdComment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { comment, commentId } = req.body;

  if (comment === ("" || null)) {
    throw new ApiError(400, "Fields cannot be blank or null");
  }

  const commentPrevious = await Comment.findById(commentId);

  if (comment?.trim() === commentPrevious.comment) {
    throw new ApiError(400, "Comment already there");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        comment: comment?.trim(),
      },
    },
    { new: true }
  ).select("-postId -userId");

  if (!updatedComment) {
    throw new ApiError(500, "Something went wrong while updating comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.body;

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (!deletedComment) {
    throw new ApiError(500, "Something went wrong while deleting comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { getPostComments, addComment, updateComment, deleteComment };
