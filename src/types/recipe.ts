export type DbRecipe = {
  id: number;
  name: string;
  ingredients: string;
  servings: number;
  oven: boolean;
  equipment: boolean;
  exotic: boolean;
  country: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  views: number;
};

export type CreateRecipeData = {
  name: string;
  ingredients: string;
  servings: number;
  oven: boolean;
  equipment: boolean;
  exotic: boolean;
  country: string;
  price: number;
};