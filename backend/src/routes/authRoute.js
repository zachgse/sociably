import express from "express";
import { auth,checkAuth,logout } from "../controllers/authController.js";

const router = express.Router();

router.post('/auth',auth);
router.get('/checkAuth',checkAuth);
router.get('/logout',logout)

export default router;