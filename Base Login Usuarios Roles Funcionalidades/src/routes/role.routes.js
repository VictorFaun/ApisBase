import { Router } from "express";
import { verifyPermission, verifyToken } from "../middlewares/authJwt.js";
import { getRoles, getRole, createRole, updateRole } from "../controllers/role.controller.js";

const router = Router();

router.get("/", [verifyToken, verifyPermission], getRoles);
router.get("/:id", [verifyToken, verifyPermission], getRole);
router.post("/", [verifyToken, verifyPermission], createRole);
router.put("/:id", [verifyToken, verifyPermission], updateRole);

export default router;