import Role from "../models/Role.js";
import User from "../models/User.js";
import Functionality from "../models/Functionality.js";
import { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_NAME, ADMIN_LAST_NAME, ADMIN_RUT } from "../config.js";


export const createRoles = async () => {
  try {
    // Count Documents
    const count = await Role.estimatedDocumentCount();

    // check for existing roles
    if (count > 0) return;


    // Create default Roles
    const values = await Promise.all([
      new Role({ name: "admin" }).save(),
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

await createRoles();
await createAdmin();
