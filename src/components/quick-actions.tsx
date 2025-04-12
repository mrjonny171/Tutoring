"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus, Upload, Video } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuickActionsProps {
  userRole: "STUDENT" | "TUTOR";
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const actions = userRole === "TUTOR" ? [
    {
      label: "Schedule Session",
      icon: Video,
      onClick: () => router.push("/dashboard/tutor/sessions/schedule"),
    },
    {
      label: "Upload Exercise",
      icon: Upload,
      onClick: () => router.push("/dashboard/tutor/exercises/upload"),
    },
    {
      label: "Upload Document",
      icon: Upload,
      onClick: () => router.push("/dashboard/tutor/documents/upload"),
    },
  ] : [
    {
      label: "Schedule Session",
      icon: Video,
      onClick: () => router.push("/dashboard/student/sessions/schedule"),
    },
  ];

  return (
    <div
      className={cn(
        "fixed right-0 top-24 z-50 flex transition-all duration-300 ease-in-out",
        isExpanded ? "translate-x-0" : "translate-x-[calc(100%-2.5rem)]"
      )}
    >
      <Button
        variant="outline"
        size="icon"
        className="absolute -left-10 top-2 h-8 w-8 rounded-full border bg-background"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div
        className={cn(
          "w-64 rounded-l-lg border bg-background p-4 shadow-lg",
          "flex flex-col gap-2"
        )}
      >
        <div className="mb-2 flex items-center gap-2 px-2 text-sm font-medium text-muted-foreground">
          <Plus className="h-4 w-4" />
          Quick Actions
        </div>
        <div className="space-y-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={action.onClick}
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
} 