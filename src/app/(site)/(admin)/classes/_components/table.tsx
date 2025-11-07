"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Meta } from "../page";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { useDebounce } from "use-debounce";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Class } from "./form";
import { deleteClassById, getAllClasses } from "@/services/classes";
import { ExcelImporter } from "@/components/ExcelImporter";
import { api } from "@/lib/api";
import { usePagination } from "@/hooks/usePagination";

type ClassesTableProps = {
  data: Class[];
  setClasses: (classes: Class[]) => void;
  meta: Meta;
  setMeta: (meta: Meta) => void;
  handlePageChange: (page: number) => void;
  rootPath: string;
  minWidth: number;
};

const ClassesPagination = ({
  meta,
  handlePageChange,
}: {
  meta: Meta;
  handlePageChange: (page: number) => void;
}) => {
  const paginationRange = usePagination({
    currentPage: meta.page,
    totalPage: meta.totalPage,
    siblingCount: 1, // Opsional, defaultnya 1
  });

  if (meta.page === 0 || paginationRange!.length < 2) {
    return null;
  }

  return (
    <Pagination className="cursor-pointer transition-all">
      <PaginationContent>
        {/* Tombol Sebelumnya */}
        {meta.page > 1 && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(meta.page - 1)}
            />
          </PaginationItem>
        )}

        {/* Nomor Halaman */}
        {paginationRange!.map((pageNumber, index) => {
          // Jika item adalah elipsis, render komponen elipsis
          if (pageNumber === "...") {
            return (
              <PaginationItem key={`dots-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          // Jika item adalah nomor halaman, render link halaman
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

        {/* Tombol Selanjutnya */}
        {meta.page < meta.totalPage && (
          <PaginationItem>
            <PaginationNext onClick={() => handlePageChange(meta.page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export const ClassesTable = ({
  data,
  setClasses,
  meta,
  setMeta,
  handlePageChange,
  rootPath,
  minWidth,
}: ClassesTableProps) => {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [search] = useDebounce(searchQuery, 600);
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useAuth();

  const deleteHandler = async (id: string) => {
    toast.loading("Loading...", { id: "deleteClass" });
    try {
      const response = await deleteClassById(id);

      if (response.success === true) {
        toast.dismiss("deleteClass");
        toast.success("Data berhasil dihapus");
        setOpenMenuId(null);
        handlePageChange(meta.page);
      }
    } catch (error) {
      toast.dismiss("deleteClass");
      toast.error("Data gagal dihapus");
      setOpenMenuId(null);
      console.error(error);
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const onDetailClick = (id: number) => {
    router.push(`${rootPath}/${id}`);
  };
  const onEditClick = (id: number) => {
    router.push(`${rootPath}/${id}/edit`);
  };

  const handleSearch = async (value: string) => {
    toast.loading("Mencari data...", { id: "getClassesBySearch" });
    try {
      const response = await getAllClasses(1, value);
      toast.dismiss("getClassesBySearch");
      setClasses(response.data);
      setMeta(response.meta);
    } catch (error) {
      toast.dismiss("getClassesBySearch");
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
    if (search.length < 2) {
      if (search.length === 0) {
        handlePageChange(1);
      }
      return;
    }
    handleSearch(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleUpload = async (selectedFile: File) => {
    if (!selectedFile) {
      toast.error("Pilih file Excel terlebih dahulu!");
      return;
    }

    setIsLoading(true);
    toast.loading("Mengunggah dan memproses file...", {
      id: "import-students",
    });

    const formData = new FormData();
    formData.append("excelFile", selectedFile);

    try {
      const response = await api.post(`/classes/import`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data.success) {
        throw new Error("Gagal mengimpor data");
      }

      toast.dismiss("import-students");
      toast.success(response.data.message);
    } catch (error) {
      toast.dismiss("import-students");
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
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
            placeholder="Cari kelas..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm
               focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 
               transition-all duration-200 placeholder:text-gray-400"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
        </div>
        <div className="flex gap-4 items-center justify-end flex-wrap">
          <ExcelImporter
            handlePageChange={handlePageChange}
            handleUpload={handleUpload}
            title="Impor Data Kelas"
            description="Impor data kelas dari file Excel"
            isLoading={isLoading}
            linkTemplate="/templates/template_kelas.xlsx"
          />
          <Button
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-all flex items-center justify-center text-sm gap-2"
            asChild
          >
            <Link href={`${rootPath}/create`}>
              <Plus />
              Buat Data
            </Link>
          </Button>
          <div className="bg-gray-200 p-1 flex items-center justify-center rounded-lg dark:bg-gray-700">
            <ClassesPagination
              meta={meta}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      <Table className={`min-w-[${minWidth}px] shadow-md relative bg-white dark:bg-gray-800`}>
        <TableHeader className="sticky shadow -top-[1px] bg-gray-100 dark:bg-gray-700">
          <TableRow className="uppercase text-gray-900 dark:text-gray-100">
            <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
              <span className="sr-only">Aksi</span>
            </TableHead>
            <TableHead className="hidden sm:table-cell font-semibold text-gray-900 dark:text-gray-100">
              Id
            </TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Kelas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow className="text-sm">
              <TableCell colSpan={12} className="text-center h-24 text-gray-600 dark:text-gray-300">
                Tidak ada data kelas.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id} className={`hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-gray-100`}>
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
                        <span className="sr-only">Toggle menu</span>
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
                              Aksi ini tidak dapat dibatalkan. Data yang sudah
                              dihapus tidak akan bisa dikembalikan lagi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteHandler(String(row.id))}
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
                <TableCell className="hidden font-medium sm:table-cell">
                  {row.id}
                </TableCell>
                <TableCell>{row.class}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};
