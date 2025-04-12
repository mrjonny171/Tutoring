"use client";

import { DashboardWrapper } from "@/components/layout/dashboard-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, List, Plus } from "lucide-react";
import { useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ScheduleSessionModal } from "@/components/scheduling/schedule-session-modal";

interface Session {
  id: string;
  title: string;
  start: Date;
  end: Date;
  tutor: {
    name: string;
    avatar: string;
  };
  type: string;
  status: "scheduled" | "completed" | "cancelled";
}

// Mock data - replace with actual data
const mockSessions: Session[] = [
  {
    id: "1",
    title: "Calculus Tutoring",
    start: new Date(2024, 2, 20, 14, 0),
    end: new Date(2024, 2, 20, 15, 0),
    tutor: {
      name: "Dr. Smith",
      avatar: "/avatars/dr-smith.png",
    },
    type: "one-on-one",
    status: "scheduled",
  },
  {
    id: "2",
    title: "Physics Review",
    start: new Date(2024, 2, 22, 10, 0),
    end: new Date(2024, 2, 22, 11, 30),
    tutor: {
      name: "Prof. Johnson",
      avatar: "/avatars/prof-johnson.png",
    },
    type: "group",
    status: "completed",
  },
];

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function StudentSessionsPage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Mock available tutors - replace with actual data
  const availableTutors = [
    { id: "1", name: "Dr. Smith", avatar: "/avatars/dr-smith.png" },
    { id: "2", name: "Prof. Johnson", avatar: "/avatars/prof-johnson.png" },
  ];

  const handleSelectEvent = (event: Session) => {
    // Handle event click
    console.log("Selected event:", event);
  };

  return (
    <DashboardWrapper>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sessions</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setView(view === "list" ? "calendar" : "list")}>
              {view === "list" ? <Calendar className="h-4 w-4 mr-2" /> : <List className="h-4 w-4 mr-2" />}
              {view === "list" ? "Calendar View" : "List View"}
            </Button>
            <Button onClick={() => setIsScheduleModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Session
            </Button>
          </div>
        </div>

        {view === "list" ? (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {mockSessions.map((session) => (
                    <div key={session.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex flex-col">
                            <h3 className="font-semibold">{session.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {session.start && session.end && (
                                <>
                                  {format(session.start, "MMMM d, yyyy")} • {format(session.start, "h:mm a")} - {format(session.end, "h:mm a")}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">{session.tutor.name}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground capitalize">{session.type}</span>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="h-[600px]">
                <BigCalendar
                  localizer={localizer}
                  events={mockSessions}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectEvent={handleSelectEvent}
                  views={["month", "week", "day"]}
                  defaultView="week"
                  style={{ height: "100%" }}
                  eventPropGetter={(event: Session) => ({
                    style: {
                      backgroundColor: event.status === "completed" ? "#e5e7eb" : "#3b82f6",
                      border: "none",
                    },
                  })}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <ScheduleSessionModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          role="STUDENT"
          availableUsers={availableTutors}
        />
      </div>
    </DashboardWrapper>
  );
} 