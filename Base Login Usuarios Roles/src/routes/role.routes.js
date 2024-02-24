import { Router } from "express";
import { verifyToken } from "../middlewares/authJwt.js";
import { getRoles, getRole, createRole, updateRole } from "../controllers/role.controller.js";

const router = Router();

router.get("/", [verifyToken], getRoles);
router.get("/:id", [verifyToken], getRole);
router.post("/", [verifyToken], createRole);
router.put("/:id", [verifyToken], updateRole);

export default router;