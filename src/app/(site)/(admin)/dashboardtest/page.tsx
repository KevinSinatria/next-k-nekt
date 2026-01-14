/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import CountUp from "@/components/CountUp";
import LineChart from "@/components/LineChart";
import PieChartt from "@/components/PieChart";
import { useHeader } from "@/context/HeaderContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
// import { RecentViolationsTable } from "@/components/PelanggaranBaru";

export default function Beranda() {
  const [jumlahSiswa, setJumlahSiswa] = useState(0);
  const [jumlahPelanggaran, setJumlahPelanggaran] = useState(0);
  const [jumlahKelas, setJumlahKelas] = useState(0);
  // const [loading, setLoading] = useState(true);
  const { setTitle } = useHeader();
  const { user, loading } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //    async function fetchDashboardData() {
  //       try {
  //          const [siswaRes, pelanggaranRes, kelasRes] = await Promise.all([
  //             fetch("https://k-nekt.vercel.app/v1/students"),
  //             fetch("https://k-nekt.vercel.app/v1/violations"),
  //             fetch("https://k-nekt.vercel.app/v1/classes"),
  //          ]);

  //          if (!siswaRes.ok || !pelanggaranRes.ok || !kelasRes.ok) {
  //             throw new Error("Gagal ambil data");
  //          }

  //          const siswaData = await siswaRes.json();
  //          const pelanggaranData = await pelanggaranRes.json();
  //          const kelasData = await kelasRes.json();

  //          setJumlahSiswa(siswaData.length);
  //          setJumlahPelanggaran(pelanggaranData.length);
  //          setJumlahKelas(kelasData.length);
  //       } catch (err) {
  //          toast.error("Gagal memuat data beranda.");
  //       } finally {
  //          setLoading(false);
  //       }
  //    }

  //    fetchDashboardData();
  // }, []);

  useEffect(() => {
    setTitle("Dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading && user?.roles.some((role) => role === "admin")) {
      router.push("/login");
      toast.error("Anda belum login, silahkan login terlebih dahulu.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Beranda Admin
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col justify-center items-center text-center shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Total Siswa
          </span>
          <CountUp
            from={0}
            to={jumlahSiswa}
            duration={1}
            className="text-3xl font-bold text-gray-900 dark:text-gray-100"
          />
        </Card>

        <Card className="p-4 flex flex-col justify-center items-center text-center shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Total Pelanggaran
          </span>
          <CountUp
            from={0}
            to={jumlahPelanggaran}
            duration={1}
            className="text-3xl font-bold text-gray-900 dark:text-gray-100"
          />
        </Card>

        <Card className="p-4 flex flex-col justify-center items-center text-center shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Total Kelas
          </span>
          <CountUp
            from={0}
            to={jumlahKelas}
            duration={1}
            className="text-3xl font-bold text-gray-900 dark:text-gray-100"
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="md:col-span-3 p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              statistik pelanggaran yang dilakukan
            </h2>
            <span className="text-sm text-blue-500 cursor-pointer hover:underline">
              Lihat detail →
            </span>
          </div>
          <div className="overflow-x-auto">
            <LineChart />
          </div>
        </Card>

        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-1 ">
            <Card className="p-4 h-70 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Pelanggaran per Kategori
              </h2>
              <PieChartt />
            </Card>
          </div>
          {/* <Card className="p-4">
            <h2 className="font-semibold mb-2">Pelanggaran Terbaru</h2>
            <RecentViolationsTable />
          </Card> */}
        </div>
      </div>
    </div>
  );
}
