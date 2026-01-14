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
  User,
  Tag,
  ReceiptText,
  ChevronsUpDown,
  ChevronDown,
  ChevronRight,
  Book,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

interface NavItem {
  name: keyof typeof iconMap;
  path?: string;
  role?: string[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
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
  "Kategori Pelanggaran": <Tag size={18} />,
  "Tipe Pelanggaran": <ReceiptText size={18} />,
  Profil: <User size={18} />,
};

// Grouped navigation structure
const navGroups: NavGroup[] = [
  {
    title: "", // No title for single items
    items: [
      {
        name: "Beranda",
        path: "/dashboard",
        role: ["admin", "kesiswaan", "kedisiplinan"],
      },
    ],
  },
  {
    title: "MANAJEMEN SISWA",
    items: [
      {
        name: "Pelanggaran",
        path: "/violations",
        role: ["admin", "kesiswaan", "kedisiplinan"],
      },
      { name: "Kelas", path: "/classes", role: ["admin"] },
      { name: "Siswa", path: "/students", role: ["admin"] },
    ],
    role: ["admin", "kesiswaan"],
  },
  {
    title: "PENGATURAN",
    items: [
      {
        name: "Kategori Pelanggaran",
        path: "/violation-categories",
        role: ["admin"],
      },
      { name: "Tipe Pelanggaran", path: "/violations-type", role: ["admin"] },
    ],
    role: ["admin"],
  },
  {
    title: "", // No title for single items
    items: [
      {
        name: "Profil",
        path: "/profile",
        role: ["admin", "kesiswaan", "kedisiplinan"],
      },
    ],
  },
];

const Sidebar = ({
  isOpen,
  setIsOpen,
  style = "gradient",
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  style?: "flat" | "gradient" | "glass";
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, setIsAuthenticated, isAuthenticated } = useAuth();
  const [accessibleGroups, setAccessibleGroups] = useState<NavGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [activeIndex, setActiveIndex] = useState<string>("");

  const initials =
    user?.username
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    user?.username?.[0].toUpperCase() ||
    "U";

  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    if (!accessibleGroups.length) return;

    // Find active item and expand its group
    accessibleGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (
          item.path === pathname ||
          (pathname.includes(item.path!) && pathname.endsWith(item.path!))
        ) {
          setActiveIndex(item.path!);
          if (group.title) {
            setExpandedGroups((prev) => new Set(prev).add(group.title));
          }
        }
      });
    });
  }, [pathname, accessibleGroups]);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated && !loading) {
      router.push("/login");
    }

    // Filter groups and items based on user role
    const filtered = navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          user?.roles.some((r) => item.role?.includes(r))
        ),
      }))
      .filter((group) => group.items.length > 0);

    setAccessibleGroups(filtered);

    // Expand all groups by default
    const allTitles = filtered.map((g) => g.title).filter(Boolean);
    setExpandedGroups(new Set(allTitles));
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

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const baseStyle = {
    flat: "bg-sky-600 dark:bg-neutral-800",
    gradient:
      "bg-gradient-to-b from-sky-600 via-sky-700 to-sky-800 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950",
    glass:
      "bg-sky-600/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-white/10 dark:border-gray-700/50",
  }[style];

  const SidebarContent = (
    <>
      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          transition: background 0.2s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.35);
        }

        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }

        /* Dark mode adjustments */
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }

        .dark .custom-scrollbar {
          scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
        }
      `}</style>

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-3.5 border-b border-white/30 dark:border-gray-700/90">
        <Image
          src="/logo_nekat.webp"
          width={200}
          height={200}
          alt="Logo"
          className="rounded-lg w-9 h-9"
        />
        <span className="font-semibold text-lg tracking-wide text-white dark:text-gray-100">
          Kesiswaan
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-4 custom-scrollbar">
        {accessibleGroups.map((group, groupIndex) => (
          <div key={`${group.title}-${groupIndex}`}>
            {/* Group Title */}
            {group.title && (
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-white/60 dark:text-gray-400 hover:text-white/80 dark:hover:text-gray-300 transition-colors uppercase tracking-wider"
              >
                <span>{group.title}</span>
                {expandedGroups.has(group.title) ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            )}

            {/* Group Items */}
            <AnimatePresence initial={false}>
              {(!group.title || expandedGroups.has(group.title)) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 overflow-hidden"
                >
                  {group.items.map((item) => {
                    const isActive = activeIndex === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          router.push(item.path!);
                          if (window.innerWidth < 1024) closeSidebar();
                        }}
                        className={`group whitespace-nowrap relative flex items-center gap-3 w-full px-8 py-3 rounded-xl text-sm font-medium transition-all
                          ${
                            isActive
                              ? "bg-white/15 dark:bg-gray-700/50 text-white dark:text-gray-100 shadow"
                              : "text-white/70 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700/30 hover:text-white dark:hover:text-gray-100"
                          }`}
                      >
                        <span className="text-lg">{iconMap[item.name]}</span>
                        {item.name}

                        {/* Animated Indicator */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.span
                              layoutId="activeIndicator"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                              className="absolute left-2 w-1.5 h-6 bg-white dark:bg-gray-100 rounded-full"
                            />
                          )}
                        </AnimatePresence>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <footer className="px-2 py-2 border-t border-white/30 dark:border-gray-700/90">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full h-full bg-white dark:bg-neutral-800 dark:hover:bg-neutral-900 flex items-center justify-start gap-3 cursor-pointer"
            >
              <span className="rounded-sm w-8 h-8 flex items-center justify-center bg-blue-600 text-white text-lg">
                {initials}
              </span>
              <div className="flex items-center flex-1 justify-between">
                <div className="flex flex-col items-start justify-start">
                  <span className="font-medium text-black dark:text-gray-100">
                    {user?.username}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Sebagai: {user?.roles.join(", ")}
                  </span>
                </div>
                <ChevronsUpDown />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-w-[80vw] w-60">
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
                    {user?.roles.join(", ")}
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                className="flex items-center gap-3"
                href="https://docs-k-nekat.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Book size={18} />
                Panduan Penggunaan
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} variant="destructive">
              <LogOut size={18} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </footer>
    </>
  );

  return (
    <>
      {/* Sidebar Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
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
              className={`fixed top-0 left-0 w-64 h-full ${baseStyle} text-white dark:text-gray-100 z-30 flex flex-col shadow-xl`}
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar Desktop */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:sticky top-0 left-0 w-64 h-screen ${baseStyle} text-white dark:text-gray-100 dark:border-r dark:border-r-gray-700 shadow-xl`}
      >
        {SidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
