"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useHeader } from "@/context/HeaderContext";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { UserType } from "@/types/users";
import { deleteUserById, getAllUsers } from "@/services/users";
import { UsersTable } from "./_components/table";

export interface Meta {
  page: number;
  limit: number;
  totalItems: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
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
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const getUsers = async (page: number = 1) => {
    toast.loading("Loading...", { id: "getUsers" });
    try {
      const res = await getAllUsers(page, "");
      toast.dismiss("getUsers");
      setUsers(res.data);
      setMeta(res.meta);
    } catch (error) {
      toast.dismiss("getUsers");
      if (error instanceof AxiosError && error.status !== 401)
        toast.error("Gagal memuat data: " + error.response?.data.message);
      else setIsAuthenticated(false);
    }
  };

  const deleteHandler = async (id: string) => {
    toast.loading("Loading...", { id: "deleteUser" });
    const original = [...users];
    setUsers((prev) => prev.filter((u) => String(u.id) !== id));
    setOpenMenuId(null);
    try {
      const res = await deleteUserById(id);
      if (res.success) {
        toast.dismiss("deleteUser");
        toast.success("Data berhasil dihapus");
        await getUsers(
          users.length === 1 && meta.page > 1 ? meta.page - 1 : meta.page,
        );
      }
    } catch (error) {
      toast.dismiss("deleteUser");
      setUsers(original);
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message ?? "Gagal menghapus");
      else toast.error("Data gagal dihapus");
    }
  };

  const handleSearch = async (value: string) => {
    toast.loading("Mencari data...", { id: "searchUsers" });
    try {
      const res = await getAllUsers(1, value);
      toast.dismiss("searchUsers");
      setUsers(res.data);
      setMeta(res.meta);
    } catch (error) {
      toast.dismiss("searchUsers");
      if (error instanceof AxiosError && error.status !== 401)
        toast.error("Gagal memuat data: " + error.response?.data.message);
      else setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (!users.length) getUsers();
  }, []);

  useEffect(() => {
    setTitle("Kelola User");
  }, [setTitle]);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
      <UsersTable
        rootPath="/users"
        minWidth={400}
        data={users}
        meta={meta}
        handlePageChange={getUsers}
        deleteHandler={deleteHandler}
        searchHandler={handleSearch}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
      />
    </div>
  );
}
