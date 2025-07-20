import express from "express";
import { getAllPost,createPost } from "../controllers/postController.js";

const router = express.Router();

router.get('/',getAllPost);
router.post("/create",createPost);

export default router;
