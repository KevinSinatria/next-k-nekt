"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, MoreHorizontal, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { getAllUsersForExport } from "@/services/users";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { UserType } from "@/types/users";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import * as XLSX from "xlsx";
import { useDebounce } from "use-debounce";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { ExcelImporter } from "@/components/ExcelImporter";
import { usePagination } from "@/hooks/usePagination";
import { Meta } from "../page";

type UsersTableProps = {
  data: UserType[];
  meta: Meta;
  handlePageChange: (page: number) => void;
  deleteHandler: (id: string) => void;
  searchHandler: (search: string) => void;
  setOpenMenuId: (id: number | null) => void;
  openMenuId: number | null;
  rootPath: string;
  minWidth: number;
};

const UsersPagination = ({
  meta,
  handlePageChange,
}: {
  meta: Meta;
  handlePageChange: (page: number) => void;
}) => {
  const paginationRange = usePagination({
    currentPage: meta.page,
    totalPage: meta.totalPage,
    siblingCount: 1,
  });
  if (meta.page === 0 || !paginationRange || paginationRange.length < 2)
    return null;
  return (
    <Pagination className="cursor-pointer transition-all">
      <PaginationContent>
        {meta.page > 1 && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(meta.page - 1)}
            />
          </PaginationItem>
        )}
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === "...")
            return (
              <PaginationItem key={`dots-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          return (
            <PaginationItem
              key={`page-${pageNumber}`}
              className={
                meta.page === pageNumber
                  ? "bg-neutral-100 rounded-md dark:bg-neutral-800"
                  : ""
              }
            >
              <PaginationLink
                onClick={() => handlePageChange(Number(pageNumber))}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {meta.page < meta.totalPage && (
          <PaginationItem>
            <PaginationNext onClick={() => handlePageChange(meta.page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export const UsersTable = ({
  data,
  meta,
  handlePageChange,
  deleteHandler,
  searchHandler,
  setOpenMenuId,
  openMenuId,
  rootPath,
}: UsersTableProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [search] = useDebounce(searchQuery, 600);
  const { setIsAuthenticated } = useAuth();

  const onDetailClick = (id: number) => router.push(`${rootPath}/${id}`);
  const onEditClick = (id: number) => router.push(`${rootPath}/${id}/edit`);

  const exportHandler = async () => {
    toast.loading("Mempersiapkan data untuk diekspor...", {
      id: "export-users",
    });
    try {
      const res = await getAllUsersForExport();
      if (!res.data.length) {
        toast.dismiss("export-users");
        toast.info("Tidak ada data untuk diekspor.");
        return;
      }
      const sheetData = res.data.map((u: UserType & { roles: string }) => ({
        Username: u.username,
        "Nama Lengkap": u.fullname,
        NIP: u.nip ?? "-",
        Roles:
          typeof u.roles === "string"
            ? u.roles
            : (u.roles as unknown as { name: string }[])
                .map((r) => r.name)
                .join(", "),
      }));
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, "Users");
      toast.dismiss("export-users");
      XLSX.writeFile(wb, "data-user-k-nekat.xlsx");
      toast.success("Data berhasil diekspor.");
    } catch {
      toast.dismiss("export-users");
      toast.error("Gagal mengekspor data.");
    }
  };

  useEffect(() => {
    if (search.length < 2) {
      if (search.length === 0) handlePageChange(1);
      return;
    }
    searchHandler(search);
  }, [search]);

  const handleUpload = async (selectedFile: File) => {
    if (!selectedFile) {
      toast.error("Pilih file Excel terlebih dahulu!");
      return;
    }
    setIsLoading(true);
    toast.loading("Mengunggah dan memproses file...", { id: "import-users" });
    const formData = new FormData();
    formData.append("excelFile", selectedFile);
    try {
      const response = await api.post(`/users/import`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!response.data.success) throw new Error("Gagal mengimpor data");
      toast.dismiss("import-users");
      toast.success(response.data.message);
    } catch (error) {
      toast.dismiss("import-users");
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message ?? "Gagal mengimpor");
      else toast.error("Gagal mengimpor data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <Input
            type="search"
            placeholder="Cari username, nama, NIP..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all placeholder:text-gray-400"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
        </div>
        <div className="flex gap-4 items-center justify-end flex-wrap">
          <ExcelImporter
            title="Impor Data User"
            description="Impor data user dari file Excel. Kolom: Username, Password, Nama Lengkap, NIP, Roles (comma separated: admin,kesiswaan,kedisiplinan)"
            linkTemplate="/templates/template_user.xlsx"
            isLoading={isLoading}
            handleUpload={handleUpload}
            handlePageChange={handlePageChange}
          />
          <Button onClick={exportHandler} className="flex items-center gap-2">
            <FileSpreadsheet />
            Export ke Excel
          </Button>
          <Button
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            asChild
          >
            <Link href={`${rootPath}/create`}>
              <Plus />
              Buat Data
            </Link>
          </Button>
          <div className="bg-gray-200 p-1 flex items-center justify-center rounded-lg dark:bg-neutral-700">
            <UsersPagination meta={meta} handlePageChange={handlePageChange} />
          </div>
        </div>
      </div>

      <Table className="shadow-md relative bg-white dark:bg-neutral-800">
        <TableHeader className="sticky shadow -top-[1px] bg-gray-100 dark:bg-neutral-700">
          <TableRow className="uppercase text-gray-900 dark:text-gray-100">
            <TableHead className="font-semibold">
              <span className="sr-only">Aksi</span>
            </TableHead>
            <TableHead className="hidden sm:table-cell font-semibold">
              #
            </TableHead>
            <TableHead className="font-semibold">Username</TableHead>
            <TableHead className="font-semibold">Nama Lengkap</TableHead>
            <TableHead className="font-semibold">NIP</TableHead>
            <TableHead className="font-semibold">Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center h-24 text-gray-600 dark:text-gray-300"
              >
                Tidak ada data user.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={row.id}
                className="hover:bg-gray-100 dark:hover:bg-neutral-900 text-sm"
              >
                <TableCell>
                  <DropdownMenu
                    open={openMenuId === row.id}
                    onOpenChange={(open) =>
                      open ? setOpenMenuId(row.id) : setOpenMenuId(null)
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onDetailClick(row.id)}
                      >
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onEditClick(row.id)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-red-600 cursor-pointer"
                            onSelect={(e) => e.preventDefault()}
                          >
                            Hapus
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Apakah Anda Yakin?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Aksi ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                deleteHandler(String(row.id));
                                setOpenMenuId(null);
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Ya, Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="hidden sm:table-cell font-medium">
                  {(meta.page - 1) * meta.limit + index + 1}
                </TableCell>
                <TableCell className="font-medium">{row.username}</TableCell>
                <TableCell>{row.fullname}</TableCell>
                <TableCell>{row.nip ?? "-"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {row.roles.map((r) => (
                      <Badge
                        key={r.id}
                        variant="outline"
                        className="capitalize text-xs"
                      >
                        {r.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};
