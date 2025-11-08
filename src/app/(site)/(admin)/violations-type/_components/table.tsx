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
import { ViolationType } from "@/types/violations-type";
import { deleteViolationTypeById, getAllViolationTypes } from "@/services/violation-types";
import { usePagination } from "@/hooks/usePagination";

type ViolationTypesTableProps = {
  data: ViolationType[];
  setViolationTypes: (types: ViolationType[]) => void;
  meta: Meta;
  setMeta: (meta: Meta) => void;
  handlePageChange: (page: number) => void;
  rootPath: string;
  minWidth: number;
};

const ViolationTypesPagination = ({
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

  if (meta.page === 0 || paginationRange!.length < 2) {
    return null;
  }

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
        {paginationRange!.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <PaginationItem key={`dots-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
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

export const ViolationTypesTable = ({
  data,
  setViolationTypes,
  meta,
  setMeta,
  handlePageChange,
  rootPath,
  minWidth,
}: ViolationTypesTableProps) => {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [search] = useDebounce(searchQuery, 600);
  const { setIsAuthenticated } = useAuth();

  const deleteHandler = async (id: string) => {
    toast.loading("Loading...", { id: "deleteViolationType" });
    try {
      const response = await deleteViolationTypeById(id);

      if (response.success === true) {
        toast.dismiss("deleteViolationType");
        toast.success("Data berhasil dihapus");
        setOpenMenuId(null);
        handlePageChange(meta.page);
      }
    } catch (error) {
      toast.dismiss("deleteViolationType");
      toast.error("Data gagal dihapus");
      setOpenMenuId(null);
      console.error(error);
    }
  };

  const onDetailClick = (id: number) => {
    router.push(`${rootPath}/${id}`);
  };
  const onEditClick = (id: number) => {
    router.push(`${rootPath}/${id}/edit`);
  };

  const handleSearch = async (value: string) => {
    toast.loading("Mencari data...", { id: "getViolationTypesBySearch" });
    try {
      const response = await getAllViolationTypes(1, value);
      toast.dismiss("getViolationTypesBySearch");
      setViolationTypes(response.data);
      setMeta(response.meta);
    } catch (error) {
      toast.dismiss("getViolationTypesBySearch");
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

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <Input
            type="search"
            placeholder="Cari tipe pelanggaran..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm
               focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 
               transition-all duration-200 placeholder:text-gray-400"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
        </div>
        <div className="flex gap-4 items-center justify-end flex-wrap">
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
            <ViolationTypesPagination
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
            <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Nama Pelanggaran</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Point</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Kategori</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Hukuman</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow className="text-sm">
              <TableCell colSpan={12} className="text-center h-24 text-gray-600 dark:text-gray-300">
                Tidak ada data tipe pelanggaran.
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
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                    {row.point}
                  </span>
                </TableCell>
                <TableCell>{row.category_name}</TableCell>
                <TableCell>{row.punishment}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};