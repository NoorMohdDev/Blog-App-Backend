import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const postSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      index: true,
      default: "Untitled",
      maxLength: [60, "Description cannot exceed 60 characters"],
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      required: true,
      type: String,
      unique: true,
      trim: true,
    },
    metaDescription: {
      type: String,
      maxLength: [150, "Description cannot exceed 150 characters"],
    },
    status: {
      type: String,
      default: "Draft",
      enum: ["Draft", "Published"],
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    featureImage: {
      type: String, // cloudinary url
      required: true,
    },
    comments: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    views: {
      type: Schema.Types.ObjectId,
      ref: "View",
    },
  },
  { timestamps: true }
);

postSchema.plugin(mongooseAggregatePaginate);

export const Post = mongoose.model("Post", postSchema);
