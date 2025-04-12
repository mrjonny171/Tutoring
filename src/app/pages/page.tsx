"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  Book, 
  Home, 
  LayoutDashboard, 
  LogIn, 
  UserPlus,
  GraduationCap,
  User
} from "lucide-react";

const pages = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    description: "Welcome to the tutoring platform",
  },
  {
    title: "Login",
    href: "/login",
    icon: LogIn,
    description: "Sign in to your account",
  },
  {
    title: "Register",
    href: "/register",
    icon: UserPlus,
    description: "Create a new account",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "View your dashboard",
  },
  {
    title: "Tutor Dashboard",
    href: "/dashboard/tutor",
    icon: GraduationCap,
    description: "Tutor-specific dashboard",
  },
  {
    title: "Student Dashboard",
    href: "/dashboard/student",
    icon: User,
    description: "Student-specific dashboard",
  },
  {
    title: "Exercises",
    href: "/exercises",
    icon: Book,
    description: "Manage exercises and solutions",
  }
];

export default function PagesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Available Pages</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => {
          const Icon = page.icon;

          return (
            <Card key={page.href}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Icon className="h-6 w-6" />
                  <CardTitle>{page.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {page.description}
                </p>
                <Button asChild>
                  <Link href={page.href}>Go to page</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 