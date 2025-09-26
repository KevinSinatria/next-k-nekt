import { api } from "@/lib/api";

export const getAllYearPeriods = async () => {
  try {
    const response = await api.get(`/year-periods`, {
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

export const getYearPeriodById = async (id: string) => {
  try {
    const response = await api.get(`/year-periods/${id}`, {
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
