"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useHeader } from "@/context/HeaderContext";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { StudentType } from "@/types/students";
import { deleteStudentByNIS, getAllStudents } from "@/services/students";
import { StudentsTable } from "./_components/table";
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

function StudentsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlPage = parsePage(searchParams.get("page"));
  const urlSearch = searchParams.get("search") ?? "";

  const [students, setStudents] = useState<StudentType[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: urlPage,
    limit: 0,
    totalItems: 0,
    totalPage: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const { setTitle } = useHeader();
  const { setIsAuthenticated, loading, yearPeriods } = useAuth();
  const [openMenuNIS, setOpenMenuNIS] = useState<string | null>(null);
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

  const getStudents = useCallback(
    async (page: number = 1, search = "") => {
      toast.loading("Loading...", { id: "getStudents" });
      try {
        if (!yearPeriods) return;
        const students = await getAllStudents(
          page,
          search,
          String(yearPeriods.id),
        );
        toast.dismiss("getStudents");
        setStudents(students.data);
        setMeta(students.meta);
      } catch (error) {
        toast.dismiss("getStudents");
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

  const deleteHandler = useCallback(
    async (nis: string) => {
      toast.loading("Loading...", { id: "deleteStudent" });
      const originalStudents = [...students];
      setStudents(originalStudents.filter((student) => student.nis !== nis));
      setOpenMenuNIS(null);

      try {
        const response = await deleteStudentByNIS(nis);

        if (response.success === true) {
          toast.dismiss("deleteStudent");
          toast.success("Data berhasil dihapus");
          if (originalStudents.length === 1 && urlPage > 1) {
            updateUrl({ page: urlPage - 1 });
          } else {
            await getStudents(urlPage, urlSearch);
          }
        }
      } catch (error) {
        toast.dismiss("deleteStudent");
        setStudents(originalStudents);
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
          return;
        }
        toast.error("Data gagal dihapus");
      }
    },
    [students, urlPage, urlSearch, updateUrl, getStudents],
  );

  useEffect(() => {
    setTitle("Data Siswa");
  }, [setTitle]);

  useEffect(() => {
    if (document.activeElement?.id !== "students-search") {
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
        getStudents(page, urlSearch);
        return;
      }
      updateUrl({ page });
    },
    [urlPage, urlSearch, updateUrl, getStudents],
  );

  useEffect(() => {
    if (loading || !yearPeriods) return;
    if (urlSearch.length === 1) return;
    getStudents(urlPage, urlSearch);
  }, [loading, yearPeriods, urlPage, urlSearch, getStudents]);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
      <StudentsTable
        rootPath="/students"
        minWidth={400}
        data={students}
        meta={meta}
        handlePageChange={handlePageChange}
        deleteHandler={deleteHandler}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openMenuNIS={openMenuNIS}
        setOpenMenuNIS={setOpenMenuNIS}
      />
    </div>
  );
}

export default function StudentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-neutral-900">
          Memuat data...
        </div>
      }
    >
      <StudentsPageContent />
    </Suspense>
  );
}
