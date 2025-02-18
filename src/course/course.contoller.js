import Course from "./course.model.js";
import User from "../user/user.model.js";


export const createdCourse = async (req, res) => {
    try {
        const { nameCourse, description } = req.body;

        const newCourse = new Course({
            nameCourse,
            description,
            teacher: req.user._id
        })

        await newCourse.save();

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            curso: newCourse,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "No se pudo crear el curso",
            error: err.message, 
        });
    }
};


export const assigCourse = async (req, res) => {
    try{
        const { user, course } = req;

     
        user.courses.push(course._id)
     
        await user.save()

     
        course.students.push(user._id);
        
        await course.save();

        
        res.status(200).json({
            success: true,
            message: "The course has been assigned correctly.",
            student: user.name,
            course: course.nameCourse
        })
    }catch(err){
        
        return res.status(500).json({
            success: false,
            message: "Error assigning course"
        })
    }
}


export const getAssignedCourses = async (req, res) => {
    try{
        const { uid } = req.params;

       
        const user = await User.findById(uid).populate("courses","nameCourse description");

        if(!user){
            return res.status(404).json({
                success: false,
                message: "Student not found"
            })
        }

        if(user.courses.length === 0){
            return res.status(200).json({
                sucess: true,
                message: "The student is not assigned to any courses",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Courses retrieved successfully",
            studentName: user.name,
            assignedCourses: user.courses
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error retrieving assigned courses"
        })
    }
}


export const getCoursesTeacher = async (req, res) => {
    try{
       
        const { uid } = req.params;

        
        const courses = await Course.find({teacher:uid }).select("nameCourse description status students").populate({
            path: "students", match: {status: true}, select: "name surname"});

       
        if (courses.length === 0) {
            return res.status(200).json({
                success: true,
                message: "The teacher is not assigned to any courses",
            });
        }

        
        return res.status(200).json({
            success: true,
            message: "Courses retrieved successfully",
            teacherId: uid,
            courses,
        });
    
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error retrieving assigned courses"
        })
    }
}


export const updateCourse = async (req, res) => {
    try{
        
        const { courseId } = req.params
        
        const { nameCourse, description } = req.body

        
        const course = await Course.findByIdAndUpdate(courseId,{ nameCourse, description },{new: true});
        
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Curso no encontrado',
            });
        }

        
        res.status(200).json({
            sucess: true,
            message: `Course Update`,
            course
        })
    }catch(err){
        
        res.status(500).json({
            success: false,
            message: "Error updating the course"
        })
    }
}


export const deleteCourse = async (req, res) => {
    try{
        
        const { courseId } = req.params

      
        const course = await Course.findById(courseId)
        
        if(!course){
            return res.status(400).json({
                sucess: false,
                message: "Course not found"
            })
        }

        
        for (const studentId of course.students) {
          
            const student = await User.findById(studentId);
            if (student) {
                
                student.courses = student.courses.filter(
                    (id) => id.toString() !== courseId
                );
                
                await student.save();
            }
        }

        
        await Course.findByIdAndDelete(courseId)

        
        return res.status(200).json({
            success: true,
            message: "Course removed",
            course
        })
    }catch(err){
       
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el Curso",
            error: err.message
        })
    }
}