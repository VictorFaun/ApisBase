import { Router } from "express";
import { verifyPermission, verifyToken } from "../middlewares/authJwt.js";
import { getFunctionalities, createFunctionality, getFunctionality, updateFunctionality } from "../controllers/functionality.controller.js";

const router = Router();

router.get("/", [verifyToken, verifyPermission], getFunctionalities);
router.get("/:id", [verifyToken, verifyPermission], getFunctionality);
router.post("/", [verifyToken, verifyPermission], createFunctionality);
router.put("/:id", [verifyToken, verifyPermission], updateFunctionality);

export default router;