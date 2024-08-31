import express from "express";
import { loginUser, myProfile, register, verifyUser } from "../controllers/user.js";
import { isAuth } from "../middleware/isAuth.js";
import { addProgress, getProgress } from "../controllers/course.js";


const router = express.Router();

router.post('/user/register',register);

router.post("/user/verify",verifyUser);

router.post("/user/login", loginUser);
router.post("/user/progress", isAuth,addProgress);
router.get("/user/progress",isAuth,getProgress)

router.get("/user/me", isAuth, myProfile);
export default router;