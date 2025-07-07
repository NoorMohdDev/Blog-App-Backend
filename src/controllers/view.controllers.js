import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { isValidObjectId } from "mongoose";
import { View } from "../models/view.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addPostViews = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const user = await View.findOneAndUpdate({userId:req.user?._id, postId: postId});

  if (!user) {
    const newView = new View({
      userId: req.user?._id,
      postId: postId,
      viewCount: 1,
    });

    await newView.save();

    return res
      .status(201)
      .json(new ApiResponse(200, newView, "View added successfully"));
  } else {
    user.viewCount += 1;
    await user.save({validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, user, "View added successfully"));
  }
});

const getPostViews = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const views = await View.aggregate([{
    $match:{
      postId: new mongoose.Types.ObjectId(postId)
    }
  },{
    $addFields:{
      viewCount:"$viewCount"
      
    }
  },
  {
    $group:{
      _id: null,
      viewCount: { $sum: "$viewCount" }
    }
  },{
    $project:{
      _id:0,
      viewCount:1
    }
  }])

  return res
    .status(200)
    .json(new ApiResponse(200, views[0].viewCount, "Views retrieved successfully"));
});

export { addPostViews, getPostViews };
