"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GraduationCap, User } from "lucide-react";
import { UserRole } from "@prisma/client";

export function RoleSwitcher() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const userRole = session?.user?.role;

  const handleRoleSwitch = async () => {
    if (!userRole) return;
    const newRole = userRole === "STUDENT" ? "TUTOR" : "STUDENT";
    await update({ 
      ...session, 
      user: { 
        ...session?.user, 
        role: newRole 
      } 
    });
    router.refresh();
  };

  if (!session?.user) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRoleSwitch}
      className="flex items-center gap-2"
    >
      {userRole === "STUDENT" ? (
        <>
          <GraduationCap className="h-4 w-4" />
          Switch to Tutor View
        </>
      ) : (
        <>
          <User className="h-4 w-4" />
          Switch to Student View
        </>
      )}
    </Button>
  );
} 