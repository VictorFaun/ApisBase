// Supongamos que tienes un modelo de usuario llamado User
import User from "../models/User.js";

// Función para verificar si un usuario tiene el rol "admin"
export const hasAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId).populate("roles");
    
    if (!user) {
      return false; // Usuario no encontrado
    }

    const adminRole = user.roles.find((role) => role.name === "admin");
    return !!adminRole; // Devuelve true si el usuario tiene el rol "admin", false de lo contrario
  } catch (error) {
    console.error(error);
    return false; // Manejo de errores
  }
};
