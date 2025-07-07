import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  // TODO: toggle subscription

  if (!isValidObjectId(blogId)) {
    throw new ApiError(400, "Invalid blog ID");
  }

  const isSubscribed = await Subscription.exists({
    subscriber: req.user._id,
    blog: blogId,
  });

  if (isSubscribed) {
    // Unsubscribe
    await Subscription.deleteOne({
      subscriber: req.user._id,
      blog: blogId,
    });
    return res.status(200).json(new ApiResponse(200, {},"Unsubscribed successfully"));
  } else {
    // Subscribe
    const subscription = new Subscription({
      subscriber: req.user._id,
      blog: blogId,
    });
    await subscription.save();
    return res
      .status(201)
      .json(new ApiResponse(200, subscription, "Subscribed successfully"));
  }
});

// controller to return subscriber list of a Blog
const getUserBlogSubscribers = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  if (!isValidObjectId(blogId)) {
    throw new ApiError(400, "Invalid blog ID");
  }

  const subscribers = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(blogId),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscriberList",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "subscriber",
              foreignField: "_id",
              as: "subscribedBy",
              pipeline:[
                {
                    $project:{
                        _id:0,
                        fullName:1,
                        avatar:1,
                        username:1
                    }
                  }
              ]
            },
          },
        ],
      },
    },
    {
        $addFields:{
            subscriberBy: "$subscriberList.subscribedBy"
        }
    }
  ]);
  
  if (!subscribers) {
    throw new ApiError(404, "Subscribers not found");
    
  }
  return res
      .status(201)
      .json(new ApiResponse(200,subscribers[0].subscriberBy,"Subscribers fetched successfully"));
});

// controller to return Blog list to which user has subscribed
const getSubscribedBlogs = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const subscribedBlogs = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
        $lookup: {
            from: "users",
            localField: "blog",
            foreignField: "_id",
            as: "blogDetails",
            pipeline: [
            {
                $project: {
                _id: 0,
                fullName: 1,
                avatar: 1,
                username: 1,
                },
            },
            ],
        },
        },
        {
        $unwind: "$blogDetails",
        },
        {
        $replaceRoot: { newRoot: "$blogDetails" },
    }
  ])

  return res
    .status(200)
    .json(new ApiResponse(200, subscribedBlogs, "Subscribed blogs fetched successfully"));
});

export { toggleSubscription, getSubscribedBlogs, getUserBlogSubscribers };
