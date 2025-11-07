"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StatsCard } from "@/components/StatsCard";
import { ViolationCategoryChart } from "@/components/charts/ViolationCategoryChart";
import { TopStudentChart } from "@/components/charts/TopStudentChart";
import { TopClassesChart } from "@/components/charts/TopClassesChart";
import { ViolationsByMonthChart } from "@/components/charts/ViolationsByMonthChart";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useHeader } from "@/context/HeaderContext";
import WelcomeSection from "@/components/WelcomeSection";

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const { yearPeriods, user } = useAuth();
  const { setTitle } = useHeader();

  const fetchStatsOverview = async () => {
    try {
      const response = await api.get(
        `/stats-overview?year_period_id=${yearPeriods?.id}`
      );
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (yearPeriods) fetchStatsOverview();
  }, [yearPeriods]);

  useEffect(() => {
    setTitle("Dashboard");
  }, []);

  if (!data) return <LoadingSkeleton />;

  const { cards, charts } = data;

  return (
    <div className="p-4 md:p-6 space-y-8 overflow-hidden dark:text-gray-300">
      <WelcomeSection userName={user?.fullname} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Statistik Kesiswaan
        </h2>
        <span className="text-sm text-muted-foreground">
          {cards.activeYear}
        </span>
      </div>

      {/* Cards Section */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:min-w-0">
          <StatsCard title="Total Siswa" value={cards.totalStudents} />
          <StatsCard
            title="Siswa Bersih"
            value={cards.cleanStudents}
            desc="Tanpa pelanggaran"
          />
          <StatsCard
            title="Guru Aktif"
            value={cards.totalActiveTeachers}
            desc="Bulan ini"
          />
          <StatsCard title="Kelas" value={cards.totalClasses} />
          <StatsCard
            title="Tingkat Disiplin"
            value={`${cards.disciplineRate}%`}
          />
          <StatsCard title="Total Pelanggaran" value={cards.totalViolations} />
          <StatsCard title="Serius" value={cards.seriousViolations} />
          <StatsCard
            title="Belum Ditindak"
            value={cards.unimplementViolation}
          />
          <StatsCard title="Rata-rata Poin" value={cards.averagePoints} />
        </div>
      </div>

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4 lg:col-span-2">
          <h3 className="font-semibold text-lg">
            Top 5 Siswa Berdasarkan Poin
          </h3>
          <TopStudentChart data={charts.topStudentByPoints} />
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4">
          <h3 className="font-semibold text-lg">Pelanggaran per Kategori</h3>
          <ViolationCategoryChart data={charts.violationByCategoryData} />
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4">
          <h3 className="font-semibold text-lg">Kelas Pelanggaran Terbanyak</h3>
          <TopClassesChart data={charts.topClasses} />
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4 lg:col-span-2">
          <h3 className="font-semibold text-lg">Tren Pelanggaran per Bulan</h3>
          <ViolationsByMonthChart data={charts.violationsByMonthData} />
        </div>
      </motion.div>
    </div>
  );
}
