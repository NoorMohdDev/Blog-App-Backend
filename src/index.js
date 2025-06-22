import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import connectDB from "./db";

dotenv.config({
    path:'./env'
})


connectDB().then(() => {
    
});