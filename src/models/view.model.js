import mongoose, {Schema} from "mongoose";

const viewSchema = new Schema({

    userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    viewCount: {
        type: Number,
        default: 0
    }

    
}, {timestamps: true})

export const View = mongoose.model("View",viewSchema)