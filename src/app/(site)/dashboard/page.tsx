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
import {
  Users,
  ShieldAlert,
  GraduationCap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  School,
  Gavel,
} from "lucide-react";
import WelcomeSection from "@/components/WelcomeSection";

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
    <div className="relative p-4 md:p-6 space-y-8 overflow-hidden dark:text-neutral-300">
      <WelcomeSection userName={user?.fullname} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Statistik Kesiswaan
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Ringkasan data pelanggaran dan kedisiplinan siswa periode{" "}
            {cards.activeYear}
          </p>
        </div>
      </div>

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

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Main Charts - Row 1 */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Tren Pelanggaran
            </h3>
          </div>
          <ViolationsByMonthChart data={charts.violationsByMonthData} />
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              Kategori Pelanggaran
            </h3>
          </div>
          <ViolationCategoryChart data={charts.violationByCategoryData} />
        </div>

        {/* Secondary Charts - Row 2 */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <School className="w-5 h-5 text-sky-500" />
              Kelas Terbanyak
            </h3>
          </div>
          <TopClassesChart data={charts.topClasses} />
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-500" />
              Siswa dengan Poin Tertinggi
            </h3>
          </div>
          <TopStudentChart data={charts.topStudentByPoints} />
        </div>
      </motion.div>
    </div>
  );
}
