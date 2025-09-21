import { formSchema } from "@/app/(site)/violations/_components/form";
import { api } from "@/lib/api";
import z from "zod";
import { id } from "zod/v4/locales";

export const getAllViolations = async (page = 1) => {
	try {
		const violations = await api.get(`/violations?page=${page}`, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});
		return violations.data;
	} catch (error) {
		console.error(error);
		throw new Error(String(error));
	}
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createViolation = async (data: any) => {
	try {
		const response = await api.post(`/violations`, data, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});
		return response.data;
	} catch (error) {
		console.error(error);
		// throw new Error(error!);
	}
};

export const getViolationById = async (id: string) => {
	try {
		const response = await api.get(`/violations/${id}`, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});
		return response.data;
	} catch (error) {
		console.error(error);
		// throw new Error(error!);
	}
};

export const updateViolationById = async (
	id: string,
	data: z.infer<typeof formSchema>
) => {
	try {
		const response = await api.put(`/violations/${id}`, data, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});
		return response.data;
	} catch (error) {
		console.error(error);
		// throw new Error(error!);
	}
};

export const implementViolationById = async (id: string) => {
   try {
      const response = await api.put(`/violations/${id}/implement`, {}, {
         headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
         },
      });
      return response.data;
   } catch (error) {
      console.error(error);
      // throw new Error(error!);
   }
}

export const unimplementViolationById = async (id: string) => {
   try {
      const response = await api.put(`/violations/${id}/unimplement`, {}, {
         headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
         },
      });
      return response.data;
   } catch (error) {
      console.error(error);
      // throw new Error(error!);
   }
}

export const deleteViolationById = async (id: string) => {
   try {
      const response = await api.delete(`/violations/${id}`, {
         headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
         },
      });
      return response.data;
   } catch (error) {
      console.error(error);
      // throw new Error(error!);
   }
}
