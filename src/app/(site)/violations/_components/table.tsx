import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Meta, Violation } from "../page"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Plus } from "lucide-react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { deleteViolationById, implementViolationById, unimplementViolationById } from "@/services/violations"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useState } from "react"

export const ViolationsTable = ({ violations, meta, handlePageChange }: { violations: Violation[], meta: Meta, handlePageChange: (page: number) => void }) => {
   const router = useRouter();
   const [openMenuId, setOpenMenuId] = useState<number | null>(null);

   const implementHandler = async (id: string) => {
      toast.loading("Loading...");
      try {
         const response = await implementViolationById(id)

         if (response.success === true) {
            toast.dismiss();
            toast.success("Pelanggaran berhasil diimplementasikan");
            setTimeout(() => { handlePageChange(meta.page) }, 1000)
         }
      } catch (error) {
         toast.error("Data gagal disimpan");
         console.error(error);
         if (error instanceof Error) {
            console.error(error.message);
         }
      }
   }

   const unimplementHandler = async (id: string) => {
      toast.loading("Loading...");
      try {
         const response = await unimplementViolationById(id)

         if (response.success === true) {
            toast.dismiss();
            toast.success("Pelanggaran berhasil diunimplementasikan");
            setTimeout(() => { handlePageChange(meta.page) }, 1000)
         }
      } catch (error) {
         toast.error("Data gagal disimpan");
         console.error(error);
         if (error instanceof Error) {
            console.error(error.message);
         }
      }
   }

   const deleteHandler = async (id: string) => {

      toast.loading("Loading...");
      try {
         const response = await deleteViolationById(id)

         if (response.success === true) {
            toast.dismiss();
            toast.success("Data berhasil dihapus");
            setOpenMenuId(null);
            setTimeout(() => { handlePageChange(meta.page) }, 1000)
         }
      } catch (error) {
         toast.error("Data gagal dihapus");
         setOpenMenuId(null);
         console.error(error);
         if (error instanceof Error) {
            console.error(error.message);
         }
      }
   }

   const onDetailClick = (id: number) => {
      router.push(`/violations/${id}`);
   }
   const onEditClick = (id: number) => {
      router.push(`/violations/edit/${id}`);
   }

   return (
      <>
         <div className="flex gap-4 justify-end items-center mb-4">
            <Link className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-all flex items-center justify-center text-sm gap-2" href="/violations/create"><Plus />Buat Data</Link>
            <div className="bg-gray-200 p-1 flex items-center justify-center rounded-lg">
               <Pagination className="cursor-pointer transition-all">
                  <PaginationContent>
                     {meta.page > 1 && (
                        <PaginationItem>
                           <PaginationPrevious onClick={() => handlePageChange(meta.page - 1)} />
                        </PaginationItem>
                     )}
                     {Array.from({ length: meta.totalPage }, (_, index) => (
                        <PaginationItem className={`${meta.page === index + 1 ? "bg-gray-300 rounded-lg" : ""}`} key={index}>
                           <PaginationLink onClick={() => handlePageChange(index + 1)}>
                              {index + 1}
                           </PaginationLink>
                        </PaginationItem>
                     ))}
                     {meta.totalPage > 5 &&
                        <PaginationItem>
                           <PaginationEllipsis />
                        </PaginationItem>
                     }
                     {meta.page != meta.totalPage && (
                        <PaginationItem>
                           <PaginationNext onClick={() => handlePageChange(meta.page + 1)} />
                        </PaginationItem>
                     )}
                  </PaginationContent>
               </Pagination>
            </div>
         </div>
         <Table className="min-w-[1200px] shadow-md relative bg-white">
            <TableHeader className="sticky shadow -top-[1px] bg-gray-100">
               <TableRow className="uppercase">
                  <TableHead className="font-semibold">
                     <span className="sr-only">Aksi</span>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell font-semibold">Id</TableHead>
                  <TableHead className="font-semibold">NIS</TableHead>
                  <TableHead className="font-semibold">Nama</TableHead>
                  <TableHead className="font-semibold">Kelas</TableHead>
                  <TableHead className="font-semibold">Nama Pelanggaran</TableHead>
                  <TableHead className="text-center font-semibold">Poin</TableHead>
                  <TableHead className="hidden lg:table-cell font-semibold">Hukuman</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold">Kategori</TableHead>
                  <TableHead className="text-center font-semibold">Dilaksanakan</TableHead>
                  <TableHead className="hidden lg:table-cell font-semibold">Guru</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold">Tanggal</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {violations.length === 0 ?
                  (<TableRow className="text-sm">
                     <TableCell colSpan={12} className="text-center h-24">Tidak ada data pelanggaran.</TableCell>
                  </TableRow>)
                  :
                  violations.map((violation, index) => (
                     <TableRow key={index} className={`${violation.implemented ? "hover:bg-green-100/50" : "hover:bg-red-100/50"} text-sm`}>
                        <TableCell>
                           <DropdownMenu open={openMenuId === violation.id} onOpenChange={(open) => open ? setOpenMenuId(violation.id) : setOpenMenuId(null)}>
                              <DropdownMenuTrigger asChild>
                                 <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                 <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                 <DropdownMenuItem className="cursor-pointer" onClick={() => onDetailClick(violation.id)}>Lihat Detail</DropdownMenuItem>
                                 <DropdownMenuItem className="cursor-pointer" onClick={() => onEditClick(violation.id)}>Edit</DropdownMenuItem>
                                 <DropdownMenuItem className={`cursor-pointer ${violation.implemented ? "text-red-600" : "text-green-600"}`} onClick={violation.implemented ? () => unimplementHandler(String(violation.id)) : () => implementHandler(String(violation.id))}>{violation.implemented ? "Belum dilaksanakan" : "Sudah dilaksanakan"}</DropdownMenuItem>
                                 <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                       <DropdownMenuItem className="text-red-600 cursor-pointer" onSelect={(e) => e.preventDefault()}>
                                          Hapus
                                       </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                       <AlertDialogHeader>
                                          <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                             Aksi ini tidak dapat dibatalkan. Data yang sudah dihapus tidak akan bisa dikembalikan lagi.
                                          </AlertDialogDescription>
                                       </AlertDialogHeader>
                                       <AlertDialogFooter>
                                          <AlertDialogCancel>Batal</AlertDialogCancel>
                                          <AlertDialogAction
                                             onClick={() => deleteHandler(String(violation.id))}
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
                        <TableCell className="hidden font-medium sm:table-cell">{violation.id}</TableCell>
                        <TableCell>{violation.nis}</TableCell>
                        <TableCell className="font-medium">{violation.name}</TableCell>
                        <TableCell>{violation.class}</TableCell>
                        <TableCell>{violation.violation_name}</TableCell>
                        <TableCell className="text-center">{violation.punishment_point}</TableCell>
                        <TableCell className="hidden lg:table-cell">{violation.punishment}</TableCell>
                        <TableCell className="hidden md:table-cell">{violation.violation_category}</TableCell>
                        <TableCell className="text-center">
                           {violation.implemented ? (
                              <Badge variant="default" className="text-white bg-emerald-600">Sudah</Badge>
                           ) : (
                              <Badge variant="destructive">Belum</Badge>
                           )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{violation.teacher}</TableCell>
                        <TableCell className="hidden md:table-cell">{new Date(violation.created_at).toLocaleDateString().replace(/\//g, "-")}</TableCell>
                     </TableRow>
                  ))}
            </TableBody>
         </Table>
      </>
   )
}
