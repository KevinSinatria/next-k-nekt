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
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Gavel,
  School,
  TrendingUp,
  Users,
} from "lucide-react";

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const { yearPeriods, user } = useAuth();
  const { setTitle } = useHeader();

  const fetchStatsOverview = async () => {
    try {
      const response = await api.get(
        `/stats-overview?year_period_id=${yearPeriods?.id}`,
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
    <div className="relative p-6 md:p-8 space-y-10 overflow-hidden dark:text-neutral-300 max-w-7xl mx-auto">
      <WelcomeSection userName={user?.fullname} />

      {/* Header */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Overview Statistik
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Ringkasan data kesiswaan periode ini.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            {cards.activeYear}
          </span>
        </div>

        {/* Cards Section */}
        {/* Stats Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Siswa"
            value={cards.totalStudents}
            icon={<Users className="w-5 h-5" />}
            desc="Siswa aktif terdaftar"
          />
          <StatsCard
            title="Tingkat Disiplin"
            value={`${cards.disciplineRate}%`}
            icon={<Activity className="w-5 h-5" />}
            desc="Persentase siswa tanpa pelanggaran"
            className="bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800"
          />
          <StatsCard
            title="Total Pelanggaran"
            value={cards.totalViolations}
            icon={<Gavel className="w-5 h-5" />}
            desc="Total kasus tercatat"
          />
          <StatsCard
            title="Rata-rata Poin"
            value={cards.averagePoints}
            icon={<TrendingUp className="w-5 h-5" />}
            desc="Poin pelanggaran per siswa"
          />

          {/* Secondary Stats Row */}
          <StatsCard
            title="Siswa Bersih"
            value={cards.cleanStudents}
            icon={<CheckCircle2 className="w-5 h-5" />}
            desc="Siswa tanpa catatan"
          />
          <StatsCard
            title="Guru Aktif"
            value={cards.totalActiveTeachers}
            icon={<Users className="w-5 h-5" />}
            desc="Guru piket bulan ini"
          />
          <StatsCard
            title="Total Kelas"
            value={cards.totalClasses}
            icon={<School className="w-5 h-5" />}
            desc="Kelas aktif"
          />
          <StatsCard
            title="Perlu Tindakan"
            value={cards.unimplementViolation}
            icon={<AlertTriangle className="w-5 h-5" />}
            desc="Pelanggaran belum ditindak"
            className="bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800"
          />
        </div>
      </div>

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white dark:bg-neutral-800/40 border border-gray-100 dark:border-neutral-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Top 5 Siswa Berdasarkan Poin
            </h3>
            {/* Optional: Add filter or action button here */}
          </div>
          <TopStudentChart data={charts.topStudentByPoints} />
        </div>

        <div className="bg-white dark:bg-neutral-800/40 border border-gray-100 dark:border-neutral-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            Pelanggaran per Kategori
          </h3>
          <ViolationCategoryChart data={charts.violationByCategoryData} />
        </div>

        <div className="bg-white dark:bg-neutral-800/40 border border-gray-100 dark:border-neutral-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            Kelas Pelanggaran Terbanyak
          </h3>
          <TopClassesChart data={charts.topClasses} />
        </div>

        <div className="bg-white dark:bg-neutral-800/40 border border-gray-100 dark:border-neutral-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6 lg:col-span-2">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            Tren Pelanggaran per Bulan
          </h3>
          <ViolationsByMonthChart data={charts.violationsByMonthData} />
        </div>
      </motion.div>
    </div>
  );
}
