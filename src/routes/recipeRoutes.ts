import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  findRecipeByName,
} from "../controllers/recipeController";

const router = Router();

router.get("/", getRecipes);
router.get("/search", findRecipeByName);
router.get("/:id", getRecipe);

router.post("/", authenticate, createRecipe);
router.put("/:id", authenticate, updateRecipe);
router.delete("/:id", authenticate, deleteRecipe);

export default router;