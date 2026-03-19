export type DbUser = {
  id: number;
  name: string;
  passwordHash: string;
};

export type RegisterData = {
  name: string;
  password: string;
};

export type LoginData = {
  name: string;
  password: string;
};