import { Router } from "express";
import { createUser, getUser, getUsers, updateUser } from "../controllers/user.controller.js";
import { verifyPermission, verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", [verifyToken, verifyPermission], getUsers);
router.get("/:id", [verifyToken, verifyPermission], getUser);
router.post("/", [verifyToken, verifyPermission], createUser);
router.put("/:id", [verifyToken, verifyPermission], updateUser);

export default router;
