import express from "express";
import { auth,checkAuth,refresh,logout } from "../controllers/authController.js";

const router = express.Router();

router.post('/auth',auth);
router.get('/checkAuth',checkAuth);
router.get('/refresh',refresh);
router.get('/logout',logout)

export default router;