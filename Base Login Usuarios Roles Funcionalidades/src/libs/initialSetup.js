import Role from "../models/Role.js";
import User from "../models/User.js";
import Functionality from "../models/Functionality.js";
import { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_NAME, ADMIN_LAST_NAME, ADMIN_RUT } from "../config.js";

export const createFunctionalities = async () => {
  try {
    // Count Documents
    const count = await Functionality.estimatedDocumentCount();

    // check for existing functionalities
    if (count > 0) return;
    
    // Create default functionalities
    const values = await Promise.all([
      new Functionality({ name: "Obtener roles", route: "GET:/api/roles/", description: "Obtiene el listado completo de todos los roles disponibles" }).save(),
      new Functionality({ name: "Obtener rol", route: "GET:/api/roles/:id/", description: "Obtiene el rol a partir de un id" }).save(),
      new Functionality({ name: "Crear rol", route: "POST:/api/roles/", description: "Crea un nuevo rol" }).save(),
      new Functionality({ name: "Actualiza rol", route: "PUT:/api/roles/:id/", description: "Actualiza un rol a partir de un id" }).save(),
      
      new Functionality({ name: "Obtener funcionalidades", route: "GET:/api/functionalities/", description: "Obtiene el listado completo de todas las funcionalidades disponibles" }).save(),
      new Functionality({ name: "Obtener funcionalidad", route: "GET:/api/functionalities/:id/", description: "Obtiene la funcionalidad a partir de un id" }).save(),
      new Functionality({ name: "Crear funcionalidad", route: "POST:/api/functionalities/", description: "Crea una nueva funcionalidad" }).save(),
      new Functionality({ name: "Actualiza funcionalidad", route: "PUT:/api/functionalities/:id/", description: "Actualiza una funcionalidad a partir de un id" }).save(),
      
      new Functionality({ name: "Obtener usuarios", route: "GET:/api/users/", description: "Obtiene el listado completo de todos los usuarios disponibles" }).save(),
      new Functionality({ name: "Obtener usuario", route: "GET:/api/users/:id/", description: "Obtiene el usuario a partir de un id" }).save(),
      new Functionality({ name: "Crear usuario", route: "POST:/api/users/", description: "Crea un nuevo usuario" }).save(),
      new Functionality({ name: "Actualiza usuario", route: "PUT:/api/users/:id/", description: "Actualiza un usuario a partir de un id" }).save(),
    ]);

    console.log(values);
  } catch (error) {
    console.error(error);
  }
  return;
};

export const createRoles = async () => {
  try {
    // Count Documents
    const count = await Role.estimatedDocumentCount();

    // check for existing roles
    if (count > 0) return;

    // get functionalities _id
    const functionalities = await Functionality.find();

    // Create default Roles
    const values = await Promise.all([
      new Role({ name: "admin", functionalities: functionalities.map((functionality) => functionality._id) }).save(),
    ]);

    console.log(values);
  } catch (error) {
    console.error(error);
  }
  
  return;
};

export const createAdmin = async () => {
  // check for an existing admin user
  const userFound = await User.findOne({ email: ADMIN_EMAIL });
  //console.log(userFound);
  if (userFound) return;

  // get roles _id
  const roles = await Role.find({ name: { $in: ["admin"] } });

  // create a new admin user
  const newUser = await User.create({
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    roles: roles.map((role) => role._id),
  });

  console.log(`new user created: ${newUser.email}`);
  return;
};

await createFunctionalities();
await createRoles();
await createAdmin();
