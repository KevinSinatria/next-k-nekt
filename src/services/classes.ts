import { formSchema } from "@/app/(site)/(admin)/classes/_components/form";
import { api } from "@/lib/api";
import z from "zod";

export const getAllClasses = async (page: number = 1, search: string = "") => {
  try {
    const response = await api.get(
      `/classes?page=${page}${search !== "" ? `&search=${search}` : ""}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(String(error), {
      cause: error,
    });
  }
};

export const getClassesByComboboxSearch = async (
  search: string,
  limit: number
) => {
  try {
    const response = await api.get(`/classes?search=${search}&limit=${limit}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(String(error), {
      cause: error,
    });
  }
};

export const getClassById = async (id: string, year_period_id: string) => {
  try {
    const response = await api.get(`/classes/${id}?year_id=${year_period_id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(String(error), {
      cause: error,
    });
  }
};

export const createClass = async (data: z.infer<typeof formSchema>) => {
  try {
    const response = await api.post(`/classes`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(String(error), {
      cause: error,
    });
  }
};

export const updateClassById = async (
  id: string,
  data: z.infer<typeof formSchema>
) => {
  try {
    const response = await api.put(`/classes/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(String(error), {
      cause: error,
    });
  }
};

export const deleteClassById = async (id: string) => {
  try {
    const response = await api.delete(`/classes/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(String(error), {
      cause: error,
    });
  }
};
