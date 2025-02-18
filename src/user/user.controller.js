import { hash, verify } from "argon2"
import User from "./user.model.js"
import courseModel from "../course/course.model.js";

/*
    Función de linea, para eliminar el perfil del usuario y desasignarlo del curso.
*/
export const deleteUser = async (req, res) => {
    try{

        const { uid } = req.params
        
        const user = await User.findById(uid);
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        user.status = false;
        await user.save();
            
        
        const courses = await courseModel.find({students: uid})
        for(const course of courses) {
            course.students = course.students.filter(
                (studentId) => studentId.toString() !== uid
            )
            await course.save()
        }

        return res.status(200).json({
            success: true,
            message: "Perfil eliminado",
            user
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el perfil",
            error: err.message
        })
    }
}


export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const  { password, ...data}  = req.body;

        if (password) {

            const user = await User.findById(uid);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado",
                });
            }

            data.password = await hash(password);
        }
        const userUpdate = await User.findByIdAndUpdate(uid, data, { new: true });

        res.status(200).json({
            success: true,
            menssage: 'Perfil Actualizado',
            userUpdate,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            menssage: 'Error al actualizar el perfil',
            error: err.message
        });
    }
}
