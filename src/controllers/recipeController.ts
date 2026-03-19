import { Request, Response } from "express";
import { pool } from "../config/db";
import { computeDifficulty } from "../services/recipeService";

export const getRecipes = async (req: Request, res: Response) => {
  const [rows] = await pool.query("SELECT * FROM recipes");
  res.json(rows);
};

export const createRecipe = async (req: Request, res: Response) => {
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
      (req as any).userId,
    ]
  );

  res.json({ message: "Recipe created" });
};

export const getRecipe = async (req: Request, res: Response) => {
  const [rows]: any = await pool.query(
    "SELECT * FROM recipes WHERE id = ?",
    [req.params.id]
  );

  const recipe = rows[0];

  if (!recipe) return res.status(404).send();

  await pool.query("UPDATE recipes SET views = views + 1 WHERE id = ?", [
    recipe.id,
  ]);

  recipe.difficulty = computeDifficulty(
    recipe.oven,
    recipe.equipment,
    recipe.exotic
  );

  res.json(recipe);
};