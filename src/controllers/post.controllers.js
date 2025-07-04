import mongoose, {isValidObjectId} from "mongoose"
import {Post} from "../models/post.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAPost = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
})

const getPostById = asyncHandler(async (req, res) => {
    const { postId } = req.params
    //TODO: get video by id
})

const updatePost = asyncHandler(async (req, res) => {
    const { postId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { postId } = req.params
})

export {
    getAllPosts,
    publishAPost,
    getPostById,
    updatePost,
    deletePost,
    togglePublishStatus
}