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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { Book, LogOut, User } from "lucide-react";
import { api } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "next-themes";

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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
  if (!mounted) return null;
  return (
    <header className="sticky top-0 z-10 w-full flex items-center justify-between gap-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-6 py-2.5 shadow-sm border-b border-gray-100/50 dark:border-gray-800/50 transition-all duration-300">
      <div className="lg:hidden flex items-center z-30">
        <button
          onClick={toggleSidebar}
          className="text-gray-900 dark:text-gray-100 focus:outline-none hover:bg-gray-100 border border-gray-300 bg-gray-50 dark:bg-gray-900 active:scale-95 dark:border-gray-800 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
        >
          <svg
            className="w-6 h-6"
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
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Skeleton className="w-24 h-6 rounded-md" />
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-blue-100 dark:ring-blue-800">
                {yearPeriodDisplay}
              </span>
            )}
          </div>
          <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center gap-3 px-2.5 border border-gray-100 dark:border-gray-800 py-1 rounded-full bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all cursor-pointer group">
                <div className="hidden md:flex flex-col items-end mr-1">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {user?.username}
                  </span>
                </div>
                <Avatar className="h-9 w-9 ring-2 ring-white dark:ring-gray-800 shadow-sm group-hover:scale-105 transition-transform">
                  <AvatarImage src="" alt={user?.fullname || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user?.fullname && (
                    <p className="font-medium">{user.fullname}</p>
                  )}
                  <p className="w-[200px] truncate text-xs text-muted-foreground">
                    {user?.roles.join(", ")}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Link
                  className="flex items-center gap-2 w-full"
                  href="/profile"
                >
                  <User size={16} />
                  <span>Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link
                  className="flex items-center gap-2 w-full"
                  href="https://docs-k-nekat.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Book size={16} />
                  <span>Panduan</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Tema
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value="light" className="cursor-pointer">
                  Terang
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark" className="cursor-pointer">
                  Gelap
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="system"
                  className="cursor-pointer"
                >
                  Sistem
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10 cursor-pointer"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          className="flex h-[100dvh] bg-gray-50 dark:bg-gray-900 text-gray-950 dark:text-gray-100"
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
