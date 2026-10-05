import { api } from "@/lib/api";
import z from "zod";
import { formSchema } from "@/app/(site)/(admin)/users/_components/form";

export const getAllUsers = async (page: number = 1, search: string = "") => {
  const res = await api.get(`/users?page=${page}${search ? `&search=${encodeURIComponent(search)}` : ""}`);
  return res.data;
};

export const getAllUsersForExport = async () => {
  const res = await api.get(`/users/all`);
  return res.data;
};

export const getAllRoles = async () => {
  const res = await api.get(`/users/roles`);
  return res.data;
};

export const getUserById = async (id: string) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const createUser = async (data: z.infer<typeof formSchema>) => {
  const res = await api.post(`/users`, data);
  return res.data;
};

export const updateUserById = async (id: string, data: z.infer<typeof formSchema>) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};

export const deleteUserById = async (id: string) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};
