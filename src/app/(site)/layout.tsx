"use client";

import { toast, Toaster } from "sonner";
import Sidebar from "@/components/SideBar";
import { HeaderProvider, useHeader } from "@/context/HeaderContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { YearPeriodType } from "@/types/year-periods";
import { Skeleton } from "@/components/ui/skeleton";
import { JSX } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { api } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  const [yearPeriodDisplay, setYearPeriodDisplay] = useState<
    string | null | JSX.Element
  >(null);
  const { user, setIsAuthenticated } = useAuth();
  const initials =
    user?.fullname
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    user?.username?.[0].toUpperCase() ||
    "U";
  const router = useRouter();

  const handleLogout = async () => {
    toast.loading("Loading...", { id: "logout" });
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("year_period");
      localStorage.removeItem("year_id");
      setIsAuthenticated(false);
      toast.dismiss("logout");
      toast.success("Berhasil logout!");
      router.push("/login");
    } catch (error) {
      toast.dismiss("logout");
      toast.error("Gagal logout");
      console.error(error);
    }
  };

  useEffect(() => {
    if (yearPeriod && !isLoading && yearPeriod.display_name) {
      setYearPeriodDisplay(yearPeriod.display_name);
    } else {
      setYearPeriodDisplay(<Skeleton className="w-32 h-6" />);
    }
  }, [yearPeriod, isLoading]);
  return (
    <header className="sticky top-0 z-10 w-full flex items-center gap-8 bg-white dark:bg-neutral-800 shadow-md px-4 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <div className="lg:hidden flex items-center justify-center top-4 left-4 z-30">
        <button
          onClick={toggleSidebar}
          className="text-gray-900 dark:text-gray-100 focus:outline-none"
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
      <div className="flex justify-between w-full items-center">
        <h1 className="text-lg flex font-semibold text-gray-900 dark:text-gray-100">
          {yearPeriodDisplay} - {title}
        </h1>
        <div className="flex items-center justify-between gap-4">
          <ThemeToggle />
          {/* <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-12 w-12 ring-0 outline-none">
                <AvatarImage src="" alt={user?.fullname || "User"} />
                <AvatarFallback className="bg-blue-600 text-white text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="absolute right-0 max-w-[80vw] w-60">
              <DropdownMenuItem
                className="flex items-center justify-start"
                asChild
              >
                <Link href={"/profile"}>
                  <div className="w-12 flex flex-col items-center justify-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user?.fullname || "User"} />
                      <AvatarFallback className="bg-blue-600 text-white text-xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col justify-center items-start">
                    <span className="font-medium capitalize">
                      {user?.username}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.role}
                    </span>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} variant="destructive">
                <LogOut size={18} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
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

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) {
    if (!toast.getToasts().find((toast) => toast.id === "unauthorized")) {
      toast.error("Anda belum login, silahkan login terlebih dahulu.", {
        id: "unauthorized",
      });
    }
    return router.push("/login");
  }

  return (
    <AuthProvider>
      <HeaderProvider>
        <div
          suppressHydrationWarning
          className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-950 dark:text-gray-100"
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
            <div className="p-6 flex-1 overflow-y-auto bg-gray-50 dark:bg-neutral-900">
              {children}
            </div>
            <Toaster richColors position="top-center" />
          </main>
        </div>
      </HeaderProvider>
    </AuthProvider>
  );
}
