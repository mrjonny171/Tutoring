"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, AuthProvider } from "@/context/AuthContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayoutInternal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { profile, signOut, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>;
  }

  if (!profile || !profile.role) {
    return <div className="flex items-center justify-center min-h-screen"><p>Error loading profile data.</p></div>;
  }

  const userRole = profile.role;

  const studentNavItems = [
    { href: "/dashboard/student", label: "Overview" },
    { href: "/dashboard/student/sessions", label: "My Sessions" },
    { href: "/dashboard/student/tutors", label: "My Tutors" },
    { href: "/dashboard/student/exercises", label: "Exercises" },
    { href: "/dashboard/student/documents", label: "Documents" },
  ];

  const tutorNavItems = [
    { href: "/dashboard/tutor", label: "Overview" },
    { href: "/dashboard/tutor/sessions", label: "Sessions" },
    { href: "/dashboard/tutor/students", label: "Students" },
    { href: "/dashboard/tutor/exercises", label: "Exercises" },
    { href: "/dashboard/tutor/documents", label: "Documents" },
  ];

  const navItems = userRole === "STUDENT" ? studentNavItems : tutorNavItems;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen flex">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 transform 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-transform duration-200 ease-in-out
          bg-background border-r p-4
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2">
              <h2 className="text-lg font-semibold">TutorHub</h2>
              <p className="text-sm text-muted-foreground">
                {userRole === "STUDENT" ? "Student Dashboard" : "Tutor Dashboard"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleSidebar}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start cursor-pointer"
                asChild
                onClick={() => setIsSidebarOpen(false)}
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>
          <div className="mt-auto pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="lg:hidden border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">TutorHub</h2>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="cursor-pointer">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthProvider>
      <DashboardLayoutInternal>{children}</DashboardLayoutInternal>
    </AuthProvider>
  );
} 