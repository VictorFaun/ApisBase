import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { SECRET } from "../config.js";

export const signupHandler = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Creating a new User Object
    const newUser = new User({
      username,
      email,
      password
    });

    // Saving the User Object in Mongodb
    const savedUser = await newUser.save();

    // Create a token
    const token = jwt.sign({ id: savedUser._id }, SECRET, {
      expiresIn: 86400 * 30, // 24 hours
    });

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const signinHandler = async (req, res) => {
  try {
    // Request body email can be an email or username
    const userFound = await User.findOne({ email: req.body.email }).populate(
      {
        path: "roles",
        match: {
          state: 1
        },
        populate: {
          path: "functionalities",
          match: {
            state: 1
          },
        }
      }
    );

    if (!userFound) return res.status(400).json({ message: "User Not Found" });

    if (!req.body.password) return res.status(401).json({ token: null, message: "Invalid Password" });

    const matchPassword = await User.comparePassword(
      req.body.password,
      userFound.password
    );

    if (!matchPassword)
      return res.status(401).json({
        token: null,
        message: "Invalid Password",
      });

    const token = jwt.sign({ id: userFound._id }, SECRET, {
      expiresIn: 86400 * 30, // 24 hours
    });

    let functionalities = []
    for (const role of userFound.roles) {
      for (const functionality of role.functionalities) {
        if (!functionalities.includes(functionality.route)) {
          functionalities.push(functionality.route)
        }
      }
    }

    res.json(
      {
        token,
        username: userFound.username,
        email: userFound.email,
        roles: userFound.roles.map((r) => r.name),
        functionalities: functionalities
      }
    );
  } catch (error) {
    console.log(error);
  }
};
