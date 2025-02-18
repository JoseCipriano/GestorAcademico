import { Router } from "express";
import { createdCourse, assigCourse, getAssignedCourses, updateCourse, deleteCourse, getCoursesTeacher } from "./course.contoller.js";
import { validarRol } from "../middlewares/validate-rol.js";
import { validateCourse } from "../middlewares/validate-course.js";

const router = Router();

router.post("/createdCourse", validarRol("TEACHER_ROLE"), createdCourse)


router.get("/teacher/:uid/courses", getCoursesTeacher)
router.post("/assignCourse", validateCourse, assigCourse)
router.get("/student/:uid/courses", getAssignedCourses)
router.put("/updateCourse/:courseId", updateCourse)
router.delete("/deleteCourse/:courseId", deleteCourse)

export default router;
