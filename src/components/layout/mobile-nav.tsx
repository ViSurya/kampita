"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cog, Compass, Home, Search } from "lucide-react";


import { cn } from "@/lib/utils";



const mobileNavItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Search", icon: Search, path: "/search" },
  { label: "Browse", icon: Compass, path: "/browse" },
//   { label: "Login", icon: User2, path: "/login" },
  { label: "Settings", icon: Cog, path: "/settings" },
];

export function MobileNav() {
  const pathname = usePathname();

  const filteredNavItems = mobileNavItems.filter(({ label }) =>
    label = "Settings"
  );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-14 items-center justify-between border-t bg-background lg:hidden">
      {filteredNavItems.map(({ label,
      icon: Icon,
      path }) => {
        
        const isActive = path === pathname;

        return (
          <Link
            key={label}
            href={path}
            className={cn(
              "flex h-full w-1/4 flex-col items-center justify-center text-center text-muted-foreground duration-700 animate-in slide-in-from-bottom-full",
              isActive && "text-secondary-foreground"
            )}
          >
            <Icon />

            <span className="text-xs font-semibold duration-200 animate-in slide-in-from-bottom-1/2">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}