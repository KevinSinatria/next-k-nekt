"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useHeader } from "@/context/HeaderContext";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { UserType } from "@/types/users";
import { deleteUserById, getAllUsers } from "@/services/users";
import { UsersTable } from "./_components/table";
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

function UsersPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlPage = parsePage(searchParams.get("page"));
  const urlSearch = searchParams.get("search") ?? "";

  const [users, setUsers] = useState<UserType[]>([]);
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
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
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

  const getUsers = useCallback(
    async (page: number = 1, search = "") => {
      toast.loading("Loading...", { id: "getUsers" });
      try {
        const res = await getAllUsers(page, search);
        toast.dismiss("getUsers");
        setUsers(res.data);
        setMeta(res.meta);
      } catch (error) {
        toast.dismiss("getUsers");
        if (error instanceof AxiosError && error.status !== 401)
          toast.error("Gagal memuat data: " + error.response?.data.message);
        else setIsAuthenticated(false);
      }
    },
    [setIsAuthenticated],
  );

  const deleteHandler = useCallback(
    async (id: string) => {
      toast.loading("Loading...", { id: "deleteUser" });
      const original = [...users];
      setUsers((prev) => prev.filter((u) => String(u.id) !== id));
      setOpenMenuId(null);
      try {
        const res = await deleteUserById(id);
        if (res.success) {
          toast.dismiss("deleteUser");
          toast.success("Data berhasil dihapus");
          if (original.length === 1 && urlPage > 1) {
            updateUrl({ page: urlPage - 1 });
          } else {
            await getUsers(urlPage, urlSearch);
          }
        }
      } catch (error) {
        toast.dismiss("deleteUser");
        setUsers(original);
        if (error instanceof AxiosError)
          toast.error(error.response?.data.message ?? "Gagal menghapus");
        else toast.error("Data gagal dihapus");
      }
    },
    [users, urlPage, urlSearch, updateUrl, getUsers],
  );

  useEffect(() => {
    setTitle("Kelola User");
  }, [setTitle]);

  useEffect(() => {
    if (document.activeElement?.id !== "users-search") {
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
        getUsers(page, urlSearch);
        return;
      }
      updateUrl({ page });
    },
    [urlPage, urlSearch, updateUrl, getUsers],
  );

  useEffect(() => {
    if (urlSearch.length === 1) return;
    getUsers(urlPage, urlSearch);
  }, [urlPage, urlSearch, getUsers]);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
      <UsersTable
        rootPath="/users"
        minWidth={400}
        data={users}
        meta={meta}
        handlePageChange={handlePageChange}
        deleteHandler={deleteHandler}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
      />
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-neutral-900">
          Memuat data...
        </div>
      }
    >
      <UsersPageContent />
    </Suspense>
  );
}
