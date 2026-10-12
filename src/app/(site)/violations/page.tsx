"use client";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ViolationsTable } from "./_components/table";
import { getAllViolations } from "@/services/violations";
import { toast } from "sonner";
import { useHeader } from "@/context/HeaderContext";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { Violation } from "./_components/form";
import { FilterType } from "./_components/FilterDialog";
import { useDebounce } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface Meta {
  page: number;
  limit: number;
  totalItems: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const FILTER_KEYS = [
  "timePreset",
  "classId",
  "categoryId",
  "teacherId",
  "status",
] as const;

const normalizeParam = (value: string | null): string | undefined =>
  !value || value === "all" ? undefined : value;

const normalizeFilter = (filter: FilterType): FilterType => ({
  timePreset: filter.timePreset === "all" ? undefined : filter.timePreset,
  classId: filter.classId === "all" ? undefined : filter.classId,
  categoryId: filter.categoryId === "all" ? undefined : filter.categoryId,
  teacherId: filter.teacherId === "all" ? undefined : filter.teacherId,
  status: filter.status === "all" ? undefined : filter.status,
});

const parsePage = (value: string | null) => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
};

function ViolationsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlPage = parsePage(searchParams.get("page"));
  const urlSearch = searchParams.get("search") ?? "";
  const urlFilter = useMemo<FilterType>(
    () => ({
      timePreset: normalizeParam(searchParams.get("timePreset")),
      classId: normalizeParam(searchParams.get("classId")),
      categoryId: normalizeParam(searchParams.get("categoryId")),
      teacherId: normalizeParam(searchParams.get("teacherId")),
      status: normalizeParam(searchParams.get("status")),
    }),
    [searchParams],
  );

  const [violations, setViolations] = useState<Violation[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: urlPage,
    limit: 0,
    totalItems: 0,
    totalPage: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const { setTitle } = useHeader();
  const { setIsAuthenticated, yearPeriods, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [search] = useDebounce(searchQuery, 600);

  const updateUrl = useCallback(
    (next: { page?: number; search?: string; filter?: FilterType }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.page !== undefined) {
        if (next.page <= 1) params.delete("page");
        else params.set("page", String(next.page));
      }
      if (next.search !== undefined) {
        if (next.search.length < 2) params.delete("search");
        else params.set("search", next.search);
      }
      if (next.filter !== undefined) {
        const clean = normalizeFilter(next.filter);
        for (const key of FILTER_KEYS) {
          if (clean[key]) params.set(key, clean[key]!);
          else params.delete(key);
        }
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [searchParams, router, pathname],
  );

  const getViolations = useCallback(
    async (page = 1, search = "", filter: FilterType) => {
      toast.loading("Loading...", { id: "getViolations" });
      try {
        if (!yearPeriods) return;
        const violations = await getAllViolations({
          page,
          search,
          year_id: String(yearPeriods.id),
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
    },
    [yearPeriods, setIsAuthenticated],
  );

  useEffect(() => {
    setTitle("Data Pelanggaran Siswa");
  }, [setTitle]);

  useEffect(() => {
    if (document.activeElement?.id !== "violations-search") {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    if (search.length > 0 && search.length < 2) return;
    if (search === urlSearch) return;
    updateUrl({ search, page: 1 });
  }, [search, urlSearch, updateUrl]);

  const applyFilter = useCallback(
    (next: FilterType) => {
      updateUrl({ filter: next, page: 1 });
    },
    [updateUrl],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page === urlPage) {
        getViolations(page, urlSearch, urlFilter);
        return;
      }
      updateUrl({ page });
    },
    [urlPage, urlSearch, urlFilter, updateUrl, getViolations],
  );

  useEffect(() => {
    if (loading || !yearPeriods) return;
    if (urlSearch.length === 1) return;
    getViolations(urlPage, urlSearch, urlFilter);
  }, [loading, yearPeriods, urlPage, urlSearch, urlFilter, getViolations]);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
      <ViolationsTable
        violations={violations}
        setViolations={setViolations}
        meta={meta}
        setMeta={setMeta}
        handlePageChange={handlePageChange}
        filter={urlFilter}
        setFilter={applyFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
}

export default function ViolationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-neutral-900">
          Memuat data...
        </div>
      }
    >
      <ViolationsPageContent />
    </Suspense>
  );
}
