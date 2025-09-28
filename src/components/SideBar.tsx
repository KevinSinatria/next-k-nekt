"use client";

import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CircleUserRound,
  SquareArrowOutUpRight,
  BarChart2,
  PersonStanding,
  PackageOpen,
  Clapperboard,
  LogOut,
  DoorOpen,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface NavItem {
  name: keyof typeof iconMap;
  path?: string;
  role?: string[];
}

const iconMap = {
  Beranda: <LayoutDashboard size={18} />,
  Profile: <CircleUserRound size={18} />,
  Pelanggaran: <SquareArrowOutUpRight size={18} />,
  Statistik: <BarChart2 size={18} />,
  "Kelola User": <PersonStanding size={18} />,
  Pesanan: <PackageOpen size={18} />,
  "Kelola Iklan": <Clapperboard size={18} />,
  Kelas: <DoorOpen size={18} />,
  Siswa: <Users size={18} />,
};

const navItems: NavItem[] = [
  // { name: "Beranda", path: "/dashboard", role: ["admin"] },
  { name: "Pelanggaran", path: "/violations", role: ["admin", "kesiswaan"] },
  { name: "Kelas", path: "/classes", role: ["admin"] },
  { name: "Siswa", path: "/students", role: ["admin"] },
];

const Sidebar = ({
  isOpen,
  setIsOpen,
  style = "gradient", // 🔥 pilih: "flat" | "gradient" | "glass"
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  style?: "flat" | "gradient" | "glass";
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, setIsAuthenticated, isAuthenticated } = useAuth();
  const [isAccessible, setIsAccessible] = useState<NavItem[] | null>([]);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    if (!isAccessible) return;
    const index = isAccessible.findIndex(
      (item) => item.path === pathname || pathname.includes(item.path!)
    );
    setActiveIndex(index);
  }, [pathname, isAccessible]);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated && !loading) {
      router.push("/login");
    }
    setIsAccessible(navItems.filter((item) => item.role?.includes(user!.role)));
  }, [loading, user, isAuthenticated, router]);

  const handleLogout = async () => {
    toast.loading("Loading...", { id: "logout" });
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("year_period");
      localStorage.removeItem("year_id");
      setIsAuthenticated(false);
      toast.dismiss("logout");
      toast.success("Logout berhasil!");
      router.push("/login");
    } catch (error) {
      toast.dismiss("logout");
      toast.error("Gagal logout");
      console.error(error);
    }
  };

  // ✅ Style variants
  const baseStyle = {
    flat: "bg-sky-600",
    gradient: "bg-gradient-to-b from-sky-600 via-sky-700 to-sky-800",
    glass: "bg-sky-600/80 backdrop-blur-xl border-r border-white/10",
  }[style];

  const SidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <Image
          src="/logo_nekat.webp"
          width={200}
          height={200}
          alt="Logo"
          className="rounded-lg w-9 h-9"
        />
        <span className="font-semibold text-lg tracking-wide">K-Nekat</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
        {isAccessible!.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={item.path}
              onClick={() => {
                router.push(item.path!);
                if (window.innerWidth < 1024) closeSidebar();
              }}
              className={`group relative flex items-center gap-3 w-full px-8 py-3 rounded-xl text-sm font-medium transition-all
        ${
          isActive
            ? "bg-white/15 text-white shadow"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        }`}
            >
              <span className="text-lg">{iconMap[item.name]}</span>
              {item.name}

              {/* 🔥 Animated Indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="activeIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute left-2 w-1.5 h-6 bg-white rounded-full"
                  />
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-6 py-5 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 
            bg-white text-red-600 hover:text-red-100 rounded-xl text-sm font-semibold shadow-md hover:bg-red-500 cursor-pointer transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Sidebar Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 🔥 Overlay klik buat close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
              onClick={closeSidebar}
            />

            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed top-0 left-0 w-64 h-full ${baseStyle} text-white z-30 flex flex-col shadow-xl`}
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar Desktop */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:sticky top-0 left-0 w-64 h-screen ${baseStyle} text-white shadow-xl`}
      >
        {SidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
