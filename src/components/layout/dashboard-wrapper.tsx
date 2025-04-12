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
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleRole}
          className="flex items-center gap-2"
        >
          {userRole === "TUTOR" ? (
            <>
              <User className="h-4 w-4" />
              Switch to Student View
            </>
          ) : (
            <>
              <GraduationCap className="h-4 w-4" />
              Switch to Tutor View
            </>
          )}
        </Button>
      </div>
      <DashboardLayout userRole={userRole}>
        {children}
      </DashboardLayout>
    </div>
  );
} 