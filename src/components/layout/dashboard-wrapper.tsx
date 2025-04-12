"use client";

import { DashboardLayout } from "./dashboard-layout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GraduationCap, User } from "lucide-react";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  const [userRole, setUserRole] = useState<"STUDENT" | "TUTOR">("TUTOR");

  const toggleRole = () => {
    setUserRole(prevRole => prevRole === "TUTOR" ? "STUDENT" : "TUTOR");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardLayout userRole={userRole}>
        {children}
      </DashboardLayout>
    </div>
  );
} 