import { api } from "@/lib/api";

type User = {
  username: string;
  password: string;
};

export const login = async ({ username, password }: User) => {
  try {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error(error);
    throw error;
  }
};
