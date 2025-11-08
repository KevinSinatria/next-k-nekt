import { formSchema } from "@/app/(site)/(admin)/violations-type/_components/form";
import { api } from "@/lib/api";
import z from "zod";

export const getAllViolationTypes = async (page = 1, search = "") => {
  try {
    const response = await api.get(
      `/violation-types?page=${page}&search=${search}`,
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
    throw error;
  }
};

export const getViolationTypeById = async (id: string) => {
  try {
    const response = await api.get(`/violation-types/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createViolationType = async (data: z.infer<typeof formSchema>) => {
  try {
    const response = await api.post(`/violation-types`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateViolationTypeById = async (
  id: string,
  data: z.infer<typeof formSchema>
) => {
  try {
    const response = await api.put(`/violation-types/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteViolationTypeById = async (id: string) => {
  try {
    const response = await api.delete(`/violation-types/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// export const getAllViolationTypes = async (page = 1, search = "") => {
//   const response = await api.get(`/violation-types?page=${page}&search=${search}`);
//   return response.data;
// };

// export const getViolationTypeById = async (id: string) => {
//   const response = await api.get(`/violation-types/${id}`);
//   return response.data;
// };

// export const createViolationType = async (data: any) => {
//   const response = await api.post("/violation-types", data);
//   return response.data;
// };

// export const updateViolationTypeById = async (id: string, data: any) => {
//   const response = await api.put(`/violation-types/${id}`, data);
//   return response.data;
// };

// export const deleteViolationTypeById = async (id: string) => {
//   const response = await api.delete(`/violation-types/${id}`);
//   return response.data;
// };
