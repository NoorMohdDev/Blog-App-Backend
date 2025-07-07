import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";
import { View } from "../models/view.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addPostViews = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const userId = req.user?._id;

  const user = await View.findById(userId);
  console.log(user);
  if (!user) {
    const newView = new View({
      userId: userId,
      postId: postId,
      viewCount: 1,
    });

    await newView.save();

    return res
      .status(201)
      .json(new ApiResponse(200, newView, "View added successfully"));
  } else {
    await updateView.save();

    return res
      .status(200)
      .json(new ApiResponse(200, updateView, "View added successfully"));
  }
});

const getPostViews = asyncHandler(async (req, res) => {});

export { addPostViews, getPostViews };
