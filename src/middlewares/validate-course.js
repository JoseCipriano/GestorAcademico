import User from "../user/user.model.js"
import Course from "../course/course.model.js"


export const validateCourse = async (req, res, next) => {
    try{
        const { userId, nameCourse } = req.body;

        //Verifica si el curso existe.
        const course = await Course.findOne({ nameCourse });
        if(!course){
            return res.status(404).json({
                success: false,
                message: "The cuorse is not exist"
            })
        }

        //Verifica si el estudiante existe.
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "The student is not exist"
            })
        }

        //Verifica si el estudiante ya esta en algun curso.
        if(user.courses.includes(course._id)) {
            return res.status(400).json({
                success: false,
                message: "The student is already registered in this course."
            })
        }

        if(user.courses.length >= 3){
            return res.status(400).json({
                success: false,
                message: "The student cannot register for more than 3 courses."
            })
        }

        req.course = course
        req.user = user
        next();
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error validating course assignment."
        })
    }
}