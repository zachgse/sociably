import express from "express";
import { getAllTest,createTest,showTest, updateTest, deleteTest } from "../controllers/testController.js";

const router = express.Router();

router.get('/',getAllTest);
router.post('/',createTest);
router.get('/:id',showTest);
router.put('/:id',updateTest);
router.delete('/:id',deleteTest);

export default router;