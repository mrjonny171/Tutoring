"use client";

import { useState } from "react";
// NOTE: DashboardWrapper should be handled by the layout file
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Circle, MessageSquare, Star, CheckCircle, Globe, Building } from "lucide-react";
import { format } from 'date-fns';
import Link from "next/link";
import { LeaveReviewModal } from "@/components/modals/leave-review-modal";
import { SessionDetailModal } from "@/components/modals/session-detail-modal";

// Interface from previous correct version
interface Session {
  id: string;
  title: string;
  start: Date;
  end: Date;
  tutor: {
    id: string;
    name: string;
    avatar: string;
  };
  type: "presential" | "online";
  status: "scheduled" | "completed" | "cancelled";
  reviewLeft: boolean;
  rating?: number;
  canReview: boolean;
}

// Mock data from previous correct version
const mockSessions: Session[] = [
  {
    id: "1",
    title: "Calculus Tutoring",
    start: new Date(2024, 2, 20, 14, 0),
    end: new Date(2024, 2, 20, 15, 0),
    tutor: { id: "t1", name: "Dr. Smith", avatar: "/avatars/dr-smith.png" },
    type: "online",
    status: "scheduled",
    reviewLeft: false,
    canReview: true,
  },
  {
    id: "2",
    title: "Physics Review",
    start: new Date(2024, 2, 22, 10, 0),
    end: new Date(2024, 2, 22, 11, 30),
    tutor: { id: "t2", name: "Prof. Johnson", avatar: "/avatars/prof-johnson.png" },
    type: "presential",
    status: "completed",
    reviewLeft: true,
    rating: 5,
    canReview: false,
  },
  {
    id: "3",
    title: "Chemistry Help",
    start: new Date(2024, 2, 18, 16, 0),
    end: new Date(2024, 2, 18, 17, 0),
    tutor: { id: "t1", name: "Dr. Smith", avatar: "/avatars/dr-smith.png" },
    type: "online",
    status: "completed",
    reviewLeft: false,
    canReview: true,
  },
];

export default function StudentSessionsPage() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [sessionToReview, setSessionToReview] = useState<Session | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const handleLeaveReviewClick = (session: Session) => {
    console.log("handleLeaveReviewClick triggered for session:", session.id);
    setSessionToReview(session);
    setIsReviewModalOpen(true);
    console.log("State after setting: sessionToReview=", session, "isReviewModalOpen=", true);
  };
  
  const handleViewDetailsClick = (session: Session) => {
    setSelectedSession(session);
    setIsDetailModalOpen(true);
  };

  const handleReviewSubmit = (sessionId: string, rating: number, comment: string) => {
    console.log("Review submitted for session", sessionId, { rating, comment });
    // TODO: API call
    setIsReviewModalOpen(false);
    setSessionToReview(null);
    // TODO: Refetch or update local state
  };

  return (
    // Explicitly NO DashboardWrapper here
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Sessions</h1>
          <p className="text-muted-foreground">View your upcoming and past tutoring sessions.</p>
        </div>
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
                    <User className="h-3 w-3"/> {session.tutor.name}
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
            <CardFooter className="grid grid-cols-2 gap-2 pt-4">
              {session.status === 'completed' && session.canReview && (
                 <Button 
                    variant="outline"
                    size="sm" 
                    className="w-full transition-all duration-150 ease-in-out hover:bg-muted/50 hover:scale-[1.03]"
                    onClick={() => handleLeaveReviewClick(session)}
                 >
                    <Star className="mr-2 h-4 w-4" /> Leave Review
                 </Button>
              )}
              {session.status === 'completed' && !session.canReview && (
                 <Button variant="outline" size="sm" disabled className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" /> Review Submitted
                 </Button>
              )}
              {session.status !== 'completed' && (
                 <Button variant="secondary" size="sm" className="w-full" disabled>
                    Session Upcoming
                 </Button>
              )}
              {/* Update this button */}
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

      {/* Leave Review Modal */}
      {sessionToReview && (
        <LeaveReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          targetUser={{
             id: sessionToReview.tutor.id,
             name: sessionToReview.tutor.name,
             avatar: sessionToReview.tutor.avatar,
             role: "TUTOR"
          }}
          onSubmit={(rating, reviewText) => {
            if (sessionToReview) {
              handleReviewSubmit(sessionToReview.id, rating, reviewText);
            }
          }}
        />
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <SessionDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          session={selectedSession}
        />
      )}
    </div>
  );
} 

