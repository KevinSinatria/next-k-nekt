"use client";

import { useEffect, useState } from "react";
import { ViolationCategoriesTable } from "./_components/table";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { getAllViolationCategories } from "@/services/violation-categories";
import { useAuth } from "@/context/AuthContext";
import { useHeader } from "@/context/HeaderContext";
import { ViolationCategoryType } from "@/types/violation-categories";

export interface Meta {
    page: number;
    limit: number;
    totalItems: number;
    totalPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export default function ViolationCategoriesPage() {
    const [categories, setCategories] = useState<ViolationCategoryType[]>([]);
    const { setTitle } = useHeader();
    const { setIsAuthenticated } = useAuth();

    const getViolationCategories = async (page = 1) => {
        toast.loading("Loading...", { id: "getViolationCategories" });
        try {
            const response = await getAllViolationCategories(page);
            toast.dismiss("getViolationCategories");
            setCategories(response.data);
        } catch (error) {
            toast.dismiss("getViolationCategories");
            if (
                error instanceof Error &&
                error instanceof AxiosError &&
                error.status !== 401
            ) {
                toast.error("Gagal memuat data: " + error.response?.data.message);
            } else {
                setIsAuthenticated(false);
            }
        }
    };

    useEffect(() => {
        setTitle("Kategori Pelanggaran");
        getViolationCategories();
    }, []);

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
          <ViolationCategoriesTable
            data={categories}
            setCategories={setCategories}
            rootPath="/violation-categories"
            minWidth={1000}
            handlePageChange={(page) => getViolationCategories(page)}
          />
        </div>
      );
}