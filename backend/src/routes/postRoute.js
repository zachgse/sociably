import express from "express";
import {createPost} from "../controllers/postController";

const router = express.Router();

router.post("/create",createPost);

export default router;
