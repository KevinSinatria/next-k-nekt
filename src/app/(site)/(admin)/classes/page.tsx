"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useHeader } from "@/context/HeaderContext";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { Class } from "./_components/form";
import { getAllClasses } from "@/services/classes";
import { ClassesTable } from "./_components/table";

export interface Meta {
  page: number;
  limit: number;
  totalItems: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
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

  const getClasses = async (page = 1) => {
    toast.loading("Loading...", { id: "getClasses" });
    try {
      const response = await getAllClasses(page);
      toast.dismiss("getClasses");
      setClasses(response.data);
      setMeta(response.meta);
    } catch (error) {
      toast.dismiss("getClasses");
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
    getClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTitle("Data Kelas");
  }, [setTitle]);

  return (
    <div className="flex flex-col h-full">
      <ClassesTable
        rootPath="/classes"
        minWidth={280}
        data={classes}
        setClasses={(classes) => setClasses(classes)}
        meta={meta}
        setMeta={(meta) => setMeta(meta)}
        handlePageChange={(page) => getClasses(page)}
      />
    </div>
  );
}
