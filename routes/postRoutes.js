import express from "express";

import { getAllPosts, createPost, getOnePost, updatePost, deletePost } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const postRouter = express.Router();

postRouter
    .route("/")
    .get(protect, getAllPosts)
    .post(protect, createPost);

postRouter
    .route("/:id")
    .get(protect, getOnePost)
    .patch(protect, updatePost)
    .delete(protect, deletePost);

export {postRouter};