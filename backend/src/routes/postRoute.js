import express from "express";
import { getAllPost,createPost,viewPost,likePost } from "../controllers/postController.js";

const router = express.Router();

router.get('/',getAllPost);
router.post("/create",createPost);
router.get("/:id",viewPost);
router.put("/:id",likePost);

export default router;
