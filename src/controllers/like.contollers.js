import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const togglePostLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  // TODO: toggle like on post

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid blog ID");
  }

  const isLiked = await Like.exists({
    userId: req.user._id,
    postId: postId,
    commentId: null,
  });


  if (isLiked) {
    // Unlike
    await Like.findByIdAndDelete(isLiked._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unliked post successfully"));
  } else {
    // like
    const like = new Like({
      userId: req.user._id,
      postId: postId,
      commentId: null,
    });
    await like.save();
    return res
      .status(201)
      .json(new ApiResponse(200, like, "Liked post successfully"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const isLiked = await Like.exists({
    userId: req.user._id,
    postId: postId || null,
    commentId: commentId,
  });
console.log(isLiked);

  if (isLiked) {
    // Unlike
    await Like.findByIdAndDelete(isLiked._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unliked comment successfully"));
  } else {
    // Subscribe
    const like = new Like({
      userId: req.user._id,
      postId: postId || null,
      commentId: commentId,
    });
    await like.save();
    return res
      .status(201)
      .json(new ApiResponse(200, like, "Liked comment successfully"));
  }
});

const getLikedPosts = asyncHandler(async (req, res) => {
  //TODO: get all liked posts
  const likedPosts = await Like.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "postId",
        foreignField: "_id",
        as: "postDetails",
      },
    },
    {
      $unwind: "$postDetails",
    },
    {
      $project: {
        _id: 0,
        title: "$postDetails.title",
        slug: "$postDetails.slug",
        featureImage: "$postDetails.featureImage",
      },
    },
  ])

  return res
      .status(200)
      .json(new ApiResponse(200, likedPosts, "Liked posts fetched successfully"));
});

const getLikedComments = asyncHandler(async (req, res) => {
  //TODO: get all liked comments

  const likedComments = await Like.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "commentId",
        foreignField: "_id",
        as: "commentDetails",
        pipeline:[{
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "commentBy",
                pipeline:[{
                    $project: {
                      _id: 0,
                      avatar: 1,
                      fullName: 1,
                      username: 1,
                    },
                }]
            },
        },{
            $project: {
              _id: 0,
              comment: 1,
              commentBy: {
                $arrayElemAt: ["$commentBy", 0],
              },
            },
        }]
      },
    },
    {
      $unwind: "$commentDetails",
    },
  ])

  return res
      .status(200)
      .json(new ApiResponse(200, likedComments[0].commentDetails, "Liked posts fetched successfully"));
});

export { toggleCommentLike, togglePostLike, getLikedPosts, getLikedComments };
