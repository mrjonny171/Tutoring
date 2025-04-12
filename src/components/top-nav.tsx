"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { RoleSwitcher } from "./role-switcher";

export function TopNav() {
  const { data: session } = useSession();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold">
            Tutoring Platform
          </Link>
          {session?.user && (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/exercises">Exercises</Link>
              <Link href="/pages">Pages</Link>
            </>
          )}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {session?.user && <RoleSwitcher />}
          {session?.user ? (
            <Button variant="outline" asChild>
              <Link href="/api/auth/signout">Sign Out</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
} 