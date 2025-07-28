import express from "express"
import { showCommentsFromPost,createComment,likeComment } from "../controllers/commentController.js";

const router = express.Router();

router.get('/:id',showCommentsFromPost);
router.post('/:id',createComment);
router.post('/like/:id',likeComment);

export default router;