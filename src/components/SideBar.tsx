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
};

const navItems: NavItem[] = [
  { name: "Beranda", path: "/dashboard", role: ["admin"] },
  { name: "Pelanggaran", path: "/violations", role: ["admin", "kesiswaan"] },
  { name: "Kelas", path: "/classes", role: ["admin"] },
];

const ITEM_HEIGHT = 56;
const ITEM_GAP = 11;

const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
      setIsAuthenticated(false);
      toast.dismiss("logout");
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const SidebarContent = (
    <>
      {/* Logo */}
      <div className="text-center font-bold tracking-wide z-10">
        <div className="py-3 rounded-lg w-20 mx-auto ml-16">
          <Image
            src="/Logo_Smk.png"
            width={50}
            height={50}
            alt="Logo Jajankuy"
            className="w-full object-contain"
          />
        </div>
      </div>

      <div className="relative h-full">
        {/* Highlight Active */}
        <AnimatePresence initial={false}>
          {activeIndex !== -1 && (
            <motion.div
              layoutId="activeHighlight"
              animate={{
                top: `${activeIndex * (ITEM_HEIGHT + ITEM_GAP)}px`,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="absolute w-[240px] h-[55px] bg-white text-black rounded-l-[32px] shadow-md z-0"
            >
              <span className="absolute top-[-50px] right-[8px] w-[33px] h-[50px] rounded-br-[200px] shadow-[15px_15px_0_15px_white] bg-transparent" />
              <span className="absolute top-[55px] right-[8px] w-[33px] h-[50px] rounded-tr-[200px] shadow-[15px_-15px_0_15px_white] bg-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu */}
        <nav className="relative flex flex-col gap-4 text-sm text-white z-10 mt-4">
          {isAccessible!.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={item.path} // ✅ pakai path biar selalu unik
                onClick={() => {
                  router.push(item.path!);
                  if (window.innerWidth < 1024) closeSidebar();
                }}
                className={`relative flex items-center gap-3 py-[15.5px] px-4 cursor-pointer font-semibold transition-all ${
                  isActive
                    ? "text-black z-20"
                    : "hover:bg-white/10 rounded-lg text-white font-normal"
                }`}
              >
                {iconMap[item.name]}
                {item.name}
              </div>
            );
          })}
        </nav>

        <div className="mt-10 pr-6">
          <button
            className="flex items-center text-sm gap-2 px-4 py-2 bg-white text-black rounded-full shadow cursor-pointer font-semibold w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Sidebar Mobile */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={closeSidebar}
          >
            <aside className="fixed top-0 left-0 w-64 h-full bg-sky-600  pl-6 py-8 z-30 overflow-y-auto lg:hidden">
              {SidebarContent}
            </aside>
          </div>
        </>
      )}

      {/* Sidebar Desktop */}
      <aside className="hidden lg:block lg:sticky top-0 left-0 w-64 h-full min-h-screen bg-sky-600 pl-6 py-8 overflow-hidden">
        {SidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
