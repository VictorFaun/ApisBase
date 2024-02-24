import Role from "../models/Role.js";
import { hasAdminRole } from "../libs/utilities.js"

export const getRoles = async (req, res) => {
  try {
    // Obtener los parámetros de la consulta
    const { name, creator, state} = req.query;

    // Construir el objeto de filtro basado en los parámetros proporcionados
    const filter = {
      state: 1
    }
    if (name) {
      // Usar expresión regular para hacer coincidencias parciales
      filter.name = { $regex: new RegExp(name, 'i') };
    }
    if (creator) {
      // Usar expresión regular para hacer coincidencias parciales
      filter.creator = { $regex: new RegExp(creator, 'i') };
    }
    if (state !== undefined) filter.state = state;

    // Realizar la búsqueda en la base de datos con los filtros
    const roles = await Role.find(filter);

    return res.json(roles);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRole = async (req, res) => {
  try {

    const roleId = req.params.id;
    const role = await Role.findOne({ _id: roleId })
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    return res.json(role);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createRole = async (req, res) => {
  try {
    const { name } = req.body;
    const newRole = await Role.create({ name, creator: req.userId });
    return res.status(201).json(newRole);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateRole = async (req, res) => {
  try {
    const roleId = req.params.id;

    if (!hasAdminRole(req.userId)) {
      // Verificar si el usuario actual es el creador del rol
      const existingRole = await Role.findOne({
        _id: roleId,
        creator: req.userId,
      });

      if (!existingRole) {
        return res.status(403).json({ error: "Permission denied. You are not the creator of this role." });
      }
    }

    const updatedRole = await Role.findByIdAndUpdate(roleId, req.body, {
      new: true,
    });

    if (!updatedRole) {
      return res.status(404).json({ error: "Role not found" });
    }

    return res.json(updatedRole);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};