"use client";
import FilterBar from "@/components/FilterBar";
import ViolationsTable from "@/components/ViolationsTable";
import { useState } from "react";

const dummyData = [
  {
    nis: "123456",
    nama: "Budi",
    kelas: "X",
    kategori: "Terlambat",
    pelanggaran: "Datang jam 08.00",
    poin: 5,
    hukuman: "Peringatan",
    tanggal: "2025-09-09",
  },
  {
    nis: "789101",
    nama: "Siti",
    kelas: "XI",
    kategori: "Bolos",
    pelanggaran: "Tidak hadir tanpa keterangan",
    poin: 10,
    hukuman: "Panggilan Orang Tua",
    tanggal: "2025-09-07",
  },
  // tambah data lain jika perlu
];

export default function ViolationsPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    kategori: "",
    hukuman: "",
    kelas: "",
    tanggal: "",
  });

  const filtered = dummyData.filter((item) => {
    return (
      (item.nama.toLowerCase().includes(search.toLowerCase()) ||
        item.nis.includes(search)) &&
      (filters.kategori ? item.kategori === filters.kategori : true) &&
      (filters.hukuman ? item.hukuman === filters.hukuman : true) &&
      (filters.kelas ? item.kelas === filters.kelas : true) &&
      (filters.tanggal ? item.tanggal === filters.tanggal : true)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Data Pelanggaran Siswa</h1>
      <FilterBar
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
      />
      <ViolationsTable data={filtered} />
    </div>
  );
}
