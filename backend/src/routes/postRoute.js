import express from "express";
import { getAllPost,createPost,viewPost,likePost } from "../controllers/postController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get('/',getAllPost);
router.post("/create", upload.single('image'), createPost);
router.get("/:id",viewPost);
router.put("/:id",likePost);

export default router;
