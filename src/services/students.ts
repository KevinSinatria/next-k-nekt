import { formSchema } from "@/app/(site)/(admin)/classes/[id]/_components/studentForm";
import { api } from "@/lib/api";
import { PromoteStudentsPayload } from "@/types/students";
import z from "zod";

export const getAllStudents = async (
  page: number = 1,
  search: string = "",
  year_period_id: string
) => {
  try {
    const response = await api.get(
      `/students?page=${page}${
        search !== "" ? `&search=${search}` : ""
      }&year_id=${year_period_id}`,
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

export const getAllStudentsForExport = async (year_period_id: string) => {
  try {
    const response = await api.get(`/students/all?year_id=${year_period_id}`, {
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

export const getStudentsByComboboxSearch = async (
  search: string,
  limit: number,
  year_period_id: string
) => {
  try {
    const response = await api.get(
      `/students?search=${search}&limit=${limit}&year_id=${year_period_id}`,
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


export const getStudentByNIS = async (nis: string, year_period_id: number) => {
  try {
    const response = await api.get(
      `/students/${nis}?year_id=${year_period_id}`,
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

export const createStudent = async (data: z.infer<typeof formSchema>) => {
  try {
    const response = await api.post(`/students`, data, {
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

export const promoteStudents = async (data: PromoteStudentsPayload, year_period_id: number) => {
  try {
    const response = await api.post(`/students/promote?year_id=${year_period_id}`, data, {
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
}

export const updateStudentByNIS = async (
  nis: string,
  data: z.infer<typeof formSchema>,
  year_period_id: number
) => {
  try {
    const response = await api.put(
      `/students/${nis}?year=${year_period_id}`,
      data,
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

export const deleteStudentByNIS = async (nis: string) => {
  try {
    const response = await api.delete(`/students/${nis}`, {
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
