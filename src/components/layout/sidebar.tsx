import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpenText,
  FileText,
  LogOut,
  Settings,
  LifeBuoy,
  CalendarDays,
  GraduationCap,
  MessageSquare,
  BookMarked,
} from "lucide-react";

// Define the structure for navigation items
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: ("STUDENT" | "TUTOR")[]; // Roles that can see this item
}

// Define navigation item templates
const navItemTemplates: Omit<NavItem, 'href'> & { baseHref: string }[] = [
  { baseHref: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["STUDENT", "TUTOR"] },
  { baseHref: "/dashboard/sessions", label: "Sessions", icon: Calendar, roles: ["STUDENT", "TUTOR"] },
  { baseHref: "/dashboard/tutor/students", label: "My Students", icon: Users, roles: ["TUTOR"] },
  { baseHref: "/dashboard/student/tutors", label: "My Tutors", icon: Users, roles: ["STUDENT"] },
  { baseHref: "/dashboard/exercises", label: "Exercises", icon: BookOpenText, roles: ["STUDENT", "TUTOR"] },
  { baseHref: "/dashboard/documents", label: "Documents", icon: FileText, roles: ["STUDENT", "TUTOR"] },
  { baseHref: "/dashboard/tutor/exercises", label: "Exercises", icon: BookMarked, roles: ["TUTOR"] },
  { baseHref: "/dashboard/tutor/documents", label: "My Documents", icon: FileText, roles: ["TUTOR"] },
  { baseHref: "/dashboard/student/exercises", label: "My Exercises", icon: GraduationCap, roles: ["STUDENT"] },
  { baseHref: "/dashboard/student/documents", label: "Marketplace", icon: FileText, roles: ["STUDENT"] },
];

const bottomNavItemTemplates: Omit<NavItem, 'href'> & { baseHref: string }[] = [
  { baseHref: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["STUDENT", "TUTOR"] },
  { baseHref: "/dashboard/help", label: "Help", icon: LifeBuoy, roles: ["STUDENT", "TUTOR"] },
];

export function Sidebar({ currentRole }: { currentRole: "STUDENT" | "TUTOR" }) {
  const pathname = usePathname();

  // Filter nav items based on the current role
  const generateNavItems = (templates: Omit<NavItem, 'href'> & { baseHref: string }[]): NavItem[] => {
    return templates
      .filter(item => {
        // Filter based on role visibility
        if (!item.roles.includes(currentRole)) return false;

        // Ensure role-specific links are ONLY shown to that role
        if (item.baseHref.startsWith('/dashboard/tutor') && currentRole !== 'TUTOR') return false;
        if (item.baseHref.startsWith('/dashboard/student') && currentRole !== 'STUDENT') return false;

        return true;
      })
      .map(item => {
        let finalHref = item.baseHref;
        // Adjust href for shared pages
        if (item.baseHref.startsWith('/dashboard/') &&
            !item.baseHref.startsWith('/dashboard/student') &&
            !item.baseHref.startsWith('/dashboard/tutor') &&
            item.baseHref !== '/dashboard') {
          finalHref = `/dashboard/${currentRole.toLowerCase()}${item.baseHref.substring('/dashboard'.length)}`;
        }
        // Ensure /dashboard points to the role-specific one
        if (item.baseHref === '/dashboard') {
          finalHref = `/dashboard/${currentRole.toLowerCase()}`;
        }
        return { ...item, href: finalHref }; // Add the calculated href
      });
  };

  const navItems = generateNavItems(navItemTemplates);
  const bottomNavItems = generateNavItems(bottomNavItemTemplates);

  // Static classes for the sidebar
  const asideClasses = cn(
    "hidden md:flex w-60 flex-col border-r", // <<< ENSURE 'fixed' is NOT present, use responsive display
    "bg-sidebar text-sidebar-foreground border-sidebar-border" // Use sidebar-specific colors
  );

  const navLinkClasses = (href: string) => cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors", // Simpler transitions
    "text-sidebar-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/10", // Use sidebar colors
    {
      "bg-sidebar-accent/20 text-sidebar-accent-foreground font-semibold": pathname === href, // Compare directly with final href
    }
  );

  return (
    <aside className={asideClasses}>
      {/* Static Header */}
      <div className="flex h-16 items-center border-b border-border px-4 shrink-0">
        <Link href="/dashboard" className="font-bold text-lg text-foreground">
          Dashboard
        </Link>
      </div>

      {/* Sidebar content */}
      <div className="flex flex-1 flex-col justify-between overflow-y-auto py-2">
        {/* Sidebar navigation links */}
        <nav className="grid items-start px-2 text-sm font-medium gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={navLinkClasses(item.href)}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom navigation links */}
        <nav className="mt-auto grid items-start px-2 text-sm font-medium gap-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={navLinkClasses(item.href)}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
} 