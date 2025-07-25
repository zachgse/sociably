import express from "express"
import { showCommentsFromPost,createComment } from "../controllers/commentController.js";

const router = express.Router();

router.get('/:id',showCommentsFromPost);
router.post('/:id',createComment);

export default router;