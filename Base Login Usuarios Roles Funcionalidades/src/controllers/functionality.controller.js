import Functionality from "../models/Functionality.js";
import { hasAdminRole } from "../libs/utilities.js"

export const getFunctionalities = async (req, res) => {
  try {
    // Obtener los parámetros de la consulta
    const { name, route, creator, state } = req.query;

    // Construir el objeto de filtro basado en los parámetros proporcionados
    const filter = {
      state: 1
    };

    if (name) {
      // Usar expresión regular para hacer coincidencias parciales
      filter.name = { $regex: new RegExp(name, 'i') };
    }

    if (route) {
      // Usar expresión regular para hacer coincidencias parciales
      filter.route = { $regex: new RegExp(route, 'i') };
    }

    if (creator) {
      // Usar expresión regular para hacer coincidencias parciales
      filter.creator = { $regex: new RegExp(creator, 'i') };
    }

    if (state !== undefined) {
      filter.state = state;
    }

    // Realizar la búsqueda en la base de datos con los filtros
    const functionalities = await Functionality.find(filter).populate("creator");

    return res.json(functionalities);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFunctionality = async (req, res) => {
  try {
    const functionalityId = req.params.id;
    const functionality = await Functionality.findOne({ _id: functionalityId }).populate("creator")
    if (!functionality) {
      return res.status(404).json({ error: "Functionality not found" });
    }
    return res.json(functionality);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createFunctionality = async (req, res) => {
  try {
    const { name, description, route } = req.body;
    const newFunctionality = await Functionality.create({ name, description, route, creator: req.userId }).populate("creator");
    return res.status(201).json(newFunctionality);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateFunctionality = async (req, res) => {
  try {
    const functionalityId = req.params.id;

    if (!hasAdminRole(req.userId)) {
      // Verificar si el usuario actual es el creador del rol
      const existingFunctionality = await Functionality.findOne({
        _id: functionalityId,
        creator: req.userId,
      });

      if (!existingFunctionality) {
        return res.status(403).json({ error: "Permission denied. You are not the creator of this functionality." });
      }
    }

    const updatedFunctionality = await Functionality.findByIdAndUpdate(functionalityId, req.body, {
      new: true,
    }).populate("creator");

    if (!updatedFunctionality) {
      return res.status(404).json({ error: "Functionality not found" });
    }

    return res.json(updatedFunctionality);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};