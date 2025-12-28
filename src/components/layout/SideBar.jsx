"use client";
import React, { useMemo } from "react";
import { workItems, otherActions } from "@/data/services";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utilty/cn";
import Link from "next/link";
import Image from "next/image";

const NOT_SHOW_ROUTES = [
  "/how-it-works",
  "/dashboard",
  "/login",
  "/register",
  "/onboarding",
  "/",
  "/help",
  "/documentation",
  "/privacy",
  "/terms",
  "/support",
];

export default function SideBar({ className = "" }) {
  const pathName = usePathname();
  const isActive = useMemo(
    () => NOT_SHOW_ROUTES.includes(pathName),
    [pathName]
  );
  if (isActive) return null;
  return (
    <aside
      className={cn(
        "flex flex-col  gap-6 bg-secondary min-h-[calc(100vh-75px)] sticky top-0 overflow-y-auto no-scrollbar border-r border-white/5",
        "p-1 md:p-4 transition-all duration-300",
        className
      )}
    >
      <nav className="flex-1 flex flex-col gap-8 mt-4 md:mt-0">
        {/* Work Items Section */}
        <section className="flex flex-col gap-2">
          <h2 className="px-3 text-xs font-bold text-muted-text uppercase tracking-widest mb-1 opacity-60 hidden md:block">
            Work Assignments
          </h2>
          {workItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </section>

        {/* Services Section */}
        <section className="flex flex-col gap-2">
          <h2 className="px-3 text-xs font-bold text-muted-text uppercase tracking-widest mb-1 opacity-60 hidden md:block">
            Services & Actions
          </h2>
          {otherActions.map((item) => (
            <NavItem key={item.button || item.name} item={item} />
          ))}
        </section>
      </nav>

      {/* Admin */}
      <div className="mt-auto pt-3 border-t border-white/10">
        <div className="p-3 rounded-xl bg-white/5 flex items-center justify-center md:justify-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-secondary font-bold text-xs shrink-0">
            A
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-semibold text-text">Admin User</span>
            <span className="text-[10px] text-muted-text">View Profile</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

const NavItem = ({ item }) => {
  const pathname = usePathname();
  const isActive = useMemo(() => pathname === item.href, [pathname]);
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl transition-all duration-300 ease-in-out",
        isActive
          ? "bg-primary text-text shadow-lg transform scale-105"
          : "hover:bg-white/10 text-surface hover:translate-x-1"
      )}
    >
      <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-primary transition-colors shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="32px"
        />
      </div>
      <div className="hidden md:flex flex-col">
        <span className="font-semibold text-sm leading-tight group-hover:text-white transition-colors">
          {item.name || item.button}
        </span>
        <span className="text-[10px] opacity-70 leading-tight hidden xl:block">
          {item.purpose?.substring(0, 30)}
          {item.purpose?.length > 30 && "..."}
        </span>
      </div>
    </Link>
  );
};
