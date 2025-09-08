"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import CountUp from "@/components/CountUp";
import LineChart from "@/components/LineChart";
import PieChartt from "@/components/PieChart";
import { RecentViolationsTable } from "@/components/PelanggaranBaru";
import AddViolationForm from "@/components/AddViolationForm";

export default function Pelanggaran() {
  const [jumlahSiswa, setJumlahSiswa] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [siswaRes] = await Promise.all([
          fetch("https://k-nekt.vercel.app/v1/violations"),
        ]);

        if (!siswaRes.ok) {
          throw new Error("Gagal ambil data");
        }

        const siswaData = await siswaRes.json();

        setJumlahSiswa(siswaData.length);
      } catch (err) {
        toast.error("Gagal memuat data beranda.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Input Pelanggaran</h1>
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Tambah Pelanggaran</h1>
        <AddViolationForm />
      </div>
    </div>
  );
}
