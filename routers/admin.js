import express from "express";
import { isAdmin, isAuth } from "../middleware/isAuth.js";
import { addLectures, createCourse, deleteCourse, deleteLecture, getAllStats, getAllUser, updateRoles } from "../controllers/admin.js";
import { uploadFiles } from "../middleware/multer.js";


const router = express.Router();

router.post('/course/new', isAuth,isAdmin,uploadFiles, createCourse);
router.post("/course/:id", isAuth, isAdmin, uploadFiles, addLectures);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);
router.get('/stats', isAuth,isAdmin,getAllStats);
router.put('/user/:id' , isAuth,isAdmin,updateRoles);
router.get('/users',isAuth,isAdmin,getAllUser)
export default router;