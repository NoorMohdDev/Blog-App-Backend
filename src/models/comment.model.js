import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({

    userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    comment:{
        type: String,
        default: null,
        trim: true
    }

}, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema)