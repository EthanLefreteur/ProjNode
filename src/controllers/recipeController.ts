import { Request, Response } from "express";
import { pool } from "../config/db";
import { computeDifficulty } from "../services/recipeService";

// Get all recipes (public)
export const getRecipes = async (req: Request, res: Response) => {
  const [rows] = await pool.query("SELECT * FROM recipes");
  res.json(rows);
};

// Create a new recipe (requires auth)
export const createRecipe = async (req: Request, res: Response) => {
  const user = req.user!;
  const data = req.body;

  await pool.query(
    `INSERT INTO recipes 
    (name, ingredients, servings, oven, equipment, exotic, country, price, authorId, views)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      data.name,
      data.ingredients,
      data.servings,
      data.oven,
      data.equipment,
      data.exotic,
      data.country,
      data.price,
      user.id,
    ]
  );

  res.json({ message: "Recipe created" });
};

// Update a recipe by ID (requires auth)
export const updateRecipe = async (req: Request, res: Response) => {
  const user = req.user!;
  const { id } = req.params;
  const data = req.body;

  const [result]: any = await pool.query(
    `UPDATE recipes SET 
      name = ?, 
      ingredients = ?, 
      servings = ?, 
      oven = ?, 
      equipment = ?, 
      exotic = ?, 
      country = ?, 
      price = ? 
     WHERE id = ?`,
    [
      data.name,
      data.ingredients,
      data.servings,
      data.oven,
      data.equipment,
      data.exotic,
      data.country,
      data.price,
      id,
    ]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  res.json({ message: "Recipe updated" });
};

// Delete a recipe by ID (requires auth)
export const deleteRecipe = async (req: Request, res: Response) => {
  const user = req.user!;
  const { id } = req.params;

  const [result]: any = await pool.query("DELETE FROM recipes WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  res.json({ message: "Recipe deleted" });
};

// Get a single recipe by ID (public)
export const getRecipe = async (req: Request, res: Response) => {
  const [rows]: any = await pool.query("SELECT * FROM recipes WHERE id = ?", [req.params.id]);
  const recipe = rows[0];

  if (!recipe) return res.status(404).send();

  await pool.query("UPDATE recipes SET views = views + 1 WHERE id = ?", [recipe.id]);

  recipe.difficulty = computeDifficulty(recipe.oven, recipe.equipment, recipe.exotic);

  res.json(recipe);
};

// Find recipes by name (public)
export const findRecipeByName = async (req: Request, res: Response) => {
  const { name } = req.query;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Name query parameter required" });
  }

  const [rows]: any = await pool.query("SELECT * FROM recipes WHERE name LIKE ?", [`%${name}%`]);

  res.json(rows);
};