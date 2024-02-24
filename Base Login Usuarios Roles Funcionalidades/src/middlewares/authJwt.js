import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";
import User from "../models/User.js";
import Role from "../models/Role.js";
import Functionality from "../models/Functionality.js"

export const verifyToken = async (req, res, next) => {
  let token = req.headers["token"];

  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });
    if (!user) return res.status(404).json({ message: "No user found" });
    if (user.state == 0) return res.status(404).json({ message: "No user found" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export const verifyPermission = async (req, res, next) => {
  try {
    const originalUrl = req.originalUrl.split('?')[0];
    const method = req.method;

    let url = originalUrl.endsWith('/') ? originalUrl : originalUrl + '/';

    if (Object.keys(req.params).length > 0) {
      const urlParts = url.split('/');

      for (let i = urlParts.length - 2, j = Object.keys(req.params).length - 1; i > 0 && j >= 0; i--) {
        if (urlParts[i] !== '' && urlParts[i] !== ':id') {
          urlParts[i] = `:${Object.keys(req.params)[j--]}`;
        }
      }

      url = urlParts.join('/');
    }

    const user = await User.findById(req.userId, { password: 0 }).populate({ path: "roles", match: { state: 1 } });

    const routes = [];

    for (const role of user.roles) {
      const functionalities = await Functionality.find({ _id: { $in: role.functionalities }, state: 1 });

      for (const functionality of functionalities) {
        if (!routes.includes(functionality.route)) {
          routes.push(functionality.route);
        }
      }
    }

    const hasPermission = routes.includes(method + ":" + url);
    console.log(method + ":" + url)
    if (hasPermission) {
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized!" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};