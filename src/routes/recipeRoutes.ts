import { Router } from "express";
import {
  getRecipes,
  getRecipe,
  createRecipe,
} from "../controllers/recipeController";

const router = Router();

router.get("/", getRecipes);
router.get("/:id", getRecipe);
router.post("/", createRecipe);

export default router;