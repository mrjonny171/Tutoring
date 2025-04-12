"use client";

import { useState } from "react";
// NOTE: DashboardWrapper should be handled by the layout file
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, Clock, User, Circle, MessageSquare, Star, Globe, Building } from "lucide-react";
import { format } from 'date-fns';
import { ScheduleSessionModal } from "@/components/scheduling/schedule-session-modal";
import Link from "next/link";
import { SessionDetailModal } from "@/components/modals/session-detail-modal";

// Interface from previous correct version
interface Session {
  id: string;
  title: string;
  start: Date;
  end: Date;
  student: {
    id: string;
    name: string;
    avatar: string;
  };
  status: "scheduled" | "completed" | "cancelled";
  type: "presential" | "online";
  rating?: number;
}

// Mock data from previous correct version
const mockSessions: Session[] = [
  {
    id: "1",
    title: "Calculus Fundamentals",
    start: new Date(2024, 2, 20, 14, 0),
    end: new Date(2024, 2, 20, 15, 0),
    student: { id: "s1", name: "Alice Johnson", avatar: "/avatars/alice.png" },
    status: "scheduled",
    type: "online",
  },
  {
    id: "2",
    title: "Advanced Physics",
    start: new Date(2024, 2, 22, 10, 0),
    end: new Date(2024, 2, 22, 11, 30),
    student: { id: "s2", name: "Bob Williams", avatar: "/avatars/bob.png" },
    status: "completed",
    type: "presential",
  },
  {
    id: "3",
    title: "Organic Chemistry Prep",
    start: new Date(2024, 2, 18, 16, 0),
    end: new Date(2024, 2, 18, 17, 0),
    student: { id: "s1", name: "Alice Johnson", avatar: "/avatars/alice.png" },
    status: "cancelled",
    type: "online",
  },
  {
    id: "4",
    title: "Linear Algebra Review",
    start: new Date(2024, 2, 25, 9, 0),
    end: new Date(2024, 2, 25, 10, 0),
    student: { id: "s3", name: "Charlie Brown", avatar: "/avatars/charlie.png" },
    status: "scheduled",
    type: "presential",
  },
];

export default function TutorSessionsPage() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  
  const availableStudents = mockSessions
    .map(s => s.student)
    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

  const handleViewDetailsClick = (session: Session) => {
    setSelectedSession(session);
    setIsDetailModalOpen(true);
  };

  return (
    // Explicitly NO DashboardWrapper here
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Sessions</h1>
          <p className="text-muted-foreground">View and manage your upcoming and past sessions.</p>
        </div>
        <Button onClick={() => setIsScheduleModalOpen(true)}>
          <CalendarPlus className="mr-2 h-4 w-4" /> Schedule Session
        </Button>
      </div>

      {/* Card Grid Layout */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockSessions.map((session) => (
          <Card 
            key={session.id} 
            className="flex flex-col transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg mb-1">{session.title}</CardTitle>
                  <CardDescription className="text-xs flex items-center gap-1.5">
                    <User className="h-3 w-3"/> {session.student.name}
                  </CardDescription>
                </div>
                <Badge variant={session.status === 'completed' ? 'secondary' : 'default'} className="capitalize">
                  {session.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-2">
              <div className="text-sm flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4"/>
                <span>{format(session.start, 'PP')} ({format(session.start, 'p')} - {format(session.end, 'p')})</span>
              </div>
              <div className="text-sm flex items-center gap-1.5 text-muted-foreground capitalize">
                {session.type === 'online' ? <Globe className="h-4 w-4" /> : <Building className="h-4 w-4" />}
                <span>{session.type}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full transition-all duration-150 ease-in-out hover:bg-muted/50 hover:scale-[1.03]" 
                onClick={() => handleViewDetailsClick(session)}
              >
                <MessageSquare className="mr-2 h-4 w-4" /> View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Scheduling Modal */}
      <ScheduleSessionModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        role="TUTOR"
        availableUsers={availableStudents}
      />
      
      {/* Session Detail Modal */}
      <SessionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        session={selectedSession}
      />
    </div>
  );
} 