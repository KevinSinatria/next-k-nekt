"use client";

import { toast, Toaster } from "sonner";
import Sidebar from "@/components/SideBar";
import { HeaderProvider, useHeader } from "@/context/HeaderContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { YearPeriodType } from "@/types/year-periods";
import { Skeleton } from "@/components/ui/skeleton";

type DynamicHeaderProps = {
  toggleSidebar: () => void;
  yearPeriod: YearPeriodType | null;
  isLoading: boolean;
};
function DynamicHeader({
  toggleSidebar,
  yearPeriod,
  isLoading,
}: DynamicHeaderProps) {
  const { title } = useHeader();
  const [yearPeriodDisplay, setYearPeriodDisplay] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (yearPeriod && !isLoading && yearPeriod.display_name) {
      setYearPeriodDisplay(yearPeriod.display_name);
    }
  }, [yearPeriod, isLoading]);
  return (
    <header className="sticky top-0 z-10 w-full flex items-center gap-8 bg-white shadow-md p-4 border-b">
      <div className="lg:hidden flex items-center justify-center top-4 left-4 z-30">
        <button
          onClick={toggleSidebar}
          className="text-black focus:outline-none"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      <h1 className="text-xl flex font-semibold">
        {title} -{" "}
        {yearPeriodDisplay ? (
          yearPeriodDisplay
        ) : (
          <Skeleton className="w-32 h-6" />
        )}
      </h1>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, loading, yearPeriods } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (
      !isAuthenticated &&
      !loading &&
      localStorage.getItem("access_token") !== null
    ) {
      router.push("/login");
      toast.error("Anda belum login, silahkan login terlebih dahulu.");
    }
  }, [isAuthenticated, router, loading]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <AuthProvider>
      <HeaderProvider>
        <div
          suppressHydrationWarning
          className="flex h-screen bg-gray-50 texy-gray-950"
        >
          <Sidebar
            isOpen={isSidebarOpen}
            style="flat"
            setIsOpen={setIsSidebarOpen}
          />
          <main className="flex-1 flex flex-col overflow-y-hidden">
            <DynamicHeader
              yearPeriod={yearPeriods}
              toggleSidebar={toggleSidebar}
              isLoading={loading}
            />
            <div className="p-6 flex-1 overflow-y-auto">{children}</div>
            <Toaster richColors position="top-center" />
          </main>
        </div>
      </HeaderProvider>
    </AuthProvider>
  );
}
