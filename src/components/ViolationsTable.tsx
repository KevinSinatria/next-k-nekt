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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

type Violation = {
  nis: string;
  nama: string;
  kelas: string;
  kategori: string;
  pelanggaran: string;
  poin: number;
  hukuman: string;
  tanggal: string;
};

type Props = {
  data: Violation[];
};

export default function ViolationsTable({ data }: Props) {
  const [selected, setSelected] = useState<Violation | null>(null);

  return (
    <>
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <div className="rounded-md border mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIS</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Pelanggaran</TableHead>
                <TableHead>Poin</TableHead>
                <TableHead>Hukuman</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    Tidak ada data.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow
                    key={index}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelected(item)}
                  >
                    <TableCell>{item.nis}</TableCell>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell>{item.kelas}</TableCell>
                    <TableCell>{item.kategori}</TableCell>
                    <TableCell>{item.pelanggaran}</TableCell>
                    <TableCell>{item.poin}</TableCell>
                    <TableCell>{item.hukuman}</TableCell>
                    <TableCell>{item.tanggal}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Modal Detail */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Pelanggaran</DialogTitle>
            <DialogDescription>
              Data lengkap pelanggaran siswa
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>NIS:</strong> {selected.nis}</div>
              <div><strong>Nama:</strong> {selected.nama}</div>
              <div><strong>Kelas:</strong> {selected.kelas}</div>
              <div><strong>Kategori:</strong> {selected.kategori}</div>
              <div><strong>Pelanggaran:</strong> {selected.pelanggaran}</div>
              <div><strong>Poin:</strong> {selected.poin}</div>
              <div><strong>Hukuman:</strong> {selected.hukuman}</div>
              <div><strong>Tanggal:</strong> {selected.tanggal}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
