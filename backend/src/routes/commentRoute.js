import express from "express"
import { showCommentsFromPost,createComment } from "../controllers/commentController.js";


const router = express.Router();

router.get('/:id/comments',showCommentsFromPost);
router.post('/:id/comments',createComment);

export default router;