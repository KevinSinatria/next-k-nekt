import { api } from "@/lib/api";

export const getAllViolationCategories = async (page = 1, search = "") => {
  const response = await api.get(`/violation-categories?page=${page}&search=${search}`);
  return response.data;
};

export const getViolationCategoryById = async (id: string) => {
  const response = await api.get(`/violation-categories/${id}`);
  return response.data;
};

export const createViolationCategory = async (data: { name: string }) => {
  const response = await api.post("/violation-categories", data);
  return response.data;
};

export const updateViolationCategoryById = async (id: string, data: { name: string }) => {
  const response = await api.put(`/violation-categories/${id}`, data);
  return response.data;
};

export const deleteViolationCategoryById = async (id: string) => {
  const response = await api.delete(`/violation-categories/${id}`);
  return response.data;
};