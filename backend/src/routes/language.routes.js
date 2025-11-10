import { Router } from "express";
import {getLanguages} from "../controllers/language.controller.js"

const router = Router();

router.get("/:langCode", getLanguages);

export default router;