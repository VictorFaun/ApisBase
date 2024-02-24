import { Router } from "express";
import { createUser, getUser, getUsers, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", [verifyToken], getUsers);
router.get("/:id", [verifyToken], getUser);
router.post("/", [verifyToken], createUser);
router.put("/:id", [verifyToken], updateUser);

export default router;
