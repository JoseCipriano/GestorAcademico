import User from "../user/user.model.js";


export const validarRol = (rolPermitido) => async (req, res, next) => {
    try {
        const { userId } = req.body; 
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        if (user.role !== rolPermitido) {
            return res.status(403).json({
                success: false,
                message: "Acceso denegado. No tienes permisos para realizar esta acción.",
            });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al validar el rol",
            error: err.message,
        });
    }
}
