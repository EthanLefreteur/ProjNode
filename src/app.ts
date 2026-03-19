import express from "express";
import authRoutes from "./routes/authRoutes";
import recipeRoutes from "./routes/recipeRoutes";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});