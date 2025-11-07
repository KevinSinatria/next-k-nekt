"use client";
import { useEffect, useState } from "react";
import { ViolationsTable } from "./_components/table";
import { getAllViolations } from "@/services/violations";
import { toast } from "sonner";
import { useHeader } from "@/context/HeaderContext";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { Violation } from "./_components/form";
import { FilterType } from "./_components/FilterDialog";
import { useDebounce } from "use-debounce";

export interface Meta {
  page: number;
  limit: number;
  totalItems: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function ViolationsPage() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 0,
    limit: 0,
    totalItems: 0,
    totalPage: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const { setTitle } = useHeader();
  const { setIsAuthenticated, yearPeriods, loading } = useAuth();
  const [filter, setFilter] = useState<FilterType>({
    timePreset: undefined,
    classId: undefined,
    categoryId: undefined,
    teacherId: undefined,
    status: undefined,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [search] = useDebounce(searchQuery, 600);

  const getViolations = async (page = 1, search = "") => {
    toast.loading("Loading...", { id: "getViolations" });
    try {
      if (!yearPeriods) return;
      const violations = await getAllViolations({
        page,
        search,
        year_id: String(yearPeriods!.id),
        timePreset: filter.timePreset,
        classId: filter.classId,
        categoryId: filter.categoryId,
        teacherId: filter.teacherId,
        status: filter.status,
      });
      toast.dismiss("getViolations");
      setViolations(violations.data);
      setMeta(violations.meta);

      if (violations.success) {
        if (
          filter.timePreset !== undefined ||
          filter.classId !== undefined ||
          filter.categoryId !== undefined ||
          filter.teacherId !== undefined ||
          filter.status !== undefined
        ) {
          toast.success("Berhasil menerapkan filter");
          return;
        }
      }
    } catch (error) {
      toast.dismiss("getViolations");
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
    if (!loading) {
      getViolations(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    setTitle("Data Pelanggaran Siswa");
  }, [setTitle]);

  //   const handleSearch = async (value: string) => {
  //     toast.loading("Mencari data...", { id: "getViolationsBySearch" });
  //     try {
  //       const response = await getAllViolations({
  //         page: 1,
  //         search: value,
  //         year_id: String(yearPeriods!.id),
  //         timePreset: filter.timePreset,
  //         classId: filter.classId,
  //         categoryId: filter.categoryId,
  //         teacherId: filter.teacherId,
  //         status: filter.status,
  //       });
  //       toast.dismiss("getViolationsBySearch");
  //       setViolations(response.data);
  //       setMeta(response.meta);
  //     } catch (error) {
  //       toast.dismiss("getViolationsBySearch");
  //       if (
  //         error instanceof Error &&
  //         error instanceof AxiosError &&
  //         error.status !== 401
  //       ) {
  //         toast.error("Gagal memuat data: " + error.response?.data.message);
  //       } else {
  //         setIsAuthenticated(false);
  //       }
  //     }
  //   };

  useEffect(() => {
    if (search.length < 2) {
      if (search.length === 0) {
        getViolations(1);
      }
      return;
    }
    getViolations(1, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filter]);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ViolationsTable
        violations={violations}
        setViolations={setViolations}
        meta={meta}
        setMeta={setMeta}
        handlePageChange={(page) => getViolations(page)}
        filter={filter}
        setFilter={setFilter}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
}
