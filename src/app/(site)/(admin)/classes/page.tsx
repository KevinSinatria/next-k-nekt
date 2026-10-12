"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useHeader } from "@/context/HeaderContext";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { Class } from "./_components/form";
import { getAllClasses } from "@/services/classes";
import { ClassesTable } from "./_components/table";
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

const parsePage = (value: string | null) => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
};

function ClassesPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlPage = parsePage(searchParams.get("page"));
  const urlSearch = searchParams.get("search") ?? "";

  const [classes, setClasses] = useState<Class[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: urlPage,
    limit: 0,
    totalItems: 0,
    totalPage: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const { setTitle } = useHeader();
  const { setIsAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [search] = useDebounce(searchQuery, 600);

  const updateUrl = useCallback(
    (next: { page?: number; search?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.page !== undefined) {
        if (next.page <= 1) params.delete("page");
        else params.set("page", String(next.page));
      }
      if (next.search !== undefined) {
        if (next.search.length < 2) params.delete("search");
        else params.set("search", next.search);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [searchParams, router, pathname],
  );

  const getClasses = useCallback(
    async (page = 1, search = "") => {
      toast.loading("Loading...", { id: "getClasses" });
      try {
        const response = await getAllClasses(page, search);
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
    },
    [setIsAuthenticated],
  );

  useEffect(() => {
    setTitle("Data Kelas");
  }, [setTitle]);

  useEffect(() => {
    if (document.activeElement?.id !== "classes-search") {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    if (search.length > 0 && search.length < 2) return;
    if (search === urlSearch) return;
    updateUrl({ search, page: 1 });
  }, [search, urlSearch, updateUrl]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page === urlPage) {
        getClasses(page, urlSearch);
        return;
      }
      updateUrl({ page });
    },
    [urlPage, urlSearch, updateUrl, getClasses],
  );

  useEffect(() => {
    if (urlSearch.length === 1) return;
    getClasses(urlPage, urlSearch);
  }, [urlPage, urlSearch, getClasses]);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
      <ClassesTable
        rootPath="/classes"
        minWidth={280}
        data={classes}
        setClasses={(classes) => setClasses(classes)}
        meta={meta}
        setMeta={(meta) => setMeta(meta)}
        handlePageChange={handlePageChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
}

export default function ClassesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-neutral-900">
          Memuat data...
        </div>
      }
    >
      <ClassesPageContent />
    </Suspense>
  );
}
