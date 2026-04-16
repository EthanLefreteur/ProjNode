import cors from "cors";
import { schemaExist, createSchema } from "./config/db";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRoutes from "./routes/authRoutes";
import recipeRoutes from "./routes/recipeRoutes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // change if your frontend runs elsewhere
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

const start = async () => {
  if (!(await schemaExist())) {
    console.log("Database does not exist! Creating...");
    await createSchema();
  } else {
    console.log("Database already exists!");
    // await deleteSchema(); // debug
  }

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
};

start();
