"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useHeader } from "@/context/HeaderContext";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { ViolationType } from "@/types/violations-type";
import { getAllViolationTypes } from "@/services/violation-types";
import { ViolationTypesTable } from "./_components/table";

export interface Meta {
  page: number;
  limit: number;
  totalItems: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function ViolationTypesPage() {
  const [violationTypes, setViolationTypes] = useState<ViolationType[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 0,
    limit: 0,
    totalItems: 0,
    totalPage: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const { setTitle } = useHeader();
  const { setIsAuthenticated } = useAuth();

  const getViolationTypes = async (page = 1) => {
    toast.loading("Loading...", { id: "getViolationTypes" });
    try {
      const response = await getAllViolationTypes(page);
      toast.dismiss("getViolationTypes");
      setViolationTypes(response.data);
      setMeta(response.meta);
    } catch (error) {
      toast.dismiss("getViolationTypes");
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
    getViolationTypes();
  }, []);

  useEffect(() => {
    setTitle("Tipe Pelanggaran");
  }, [setTitle]);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
      <ViolationTypesTable
        rootPath="/violations-type"
        minWidth={600}
        data={violationTypes}
        setViolationTypes={(types) => setViolationTypes(types)}
        meta={meta}
        setMeta={(meta) => setMeta(meta)}
        handlePageChange={(page) => getViolationTypes(page)}
      />
    </div>
  );
}