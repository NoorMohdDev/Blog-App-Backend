import mongoose, {Schema} from "mongoose";

const viewSchema = new Schema({

    userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    }

    
}, {timestamps: true})

export const View = mongoose.model("View",viewSchema)