"use client";

import { useState, useEffect } from 'react';
// NOTE: DashboardWrapper should be handled by the layout file
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Circle, MessageSquare, Star, CheckCircle, Globe, Building, CalendarPlus, Eye } from "lucide-react";
import { format } from 'date-fns';
import Link from "next/link";
import { LeaveReviewModal } from "@/components/modals/leave-review-modal";
import { SessionDetailModal } from "@/components/modals/session-detail-modal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useAuth, UserProfile } from '@/context/AuthContext'; // Import useAuth and UserProfile
import { createClient } from '@/lib/supabase/client'; // Import Supabase client

// Define the shape of the session data fetched from Supabase
// Including related tutor profile data
interface FetchedSession {
  id: string;
  title: string;
  start_time: string; // Timestamps are strings initially
  end_time: string;
  type: "presential" | "online";
  status: "scheduled" | "completed" | "cancelled";
  tutor_id: string;
  profiles: UserProfile | null; // Nested tutor profile data
  // We'll need to fetch reviews separately to determine `canReview`
  // Add other fields as needed by modals (e.g., join_url)
}

export default function StudentSessionsPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [sessions, setSessions] = useState<FetchedSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [sessionToReview, setSessionToReview] = useState<FetchedSession | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<FetchedSession | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // --- Data Fetching --- 
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { data, error: sessionsError } = await supabase
          .from('sessions')
          .select(`
            id,
            title,
            start_time,
            end_time,
            type,
            status,
            tutor_id,
            profiles ( * ) 
          `)
          .eq('student_id', user.id)
          .order('start_time', { ascending: false }); // Order by newest first

        if (sessionsError) throw sessionsError;

        // TODO: Fetch reviews for these sessions to determine `canReview` status
        // For now, assume canReview is true if completed

        setSessions(data || []);
      } catch (err: any) {
        console.error("Error fetching student sessions:", err);
        setError(err.message || "Failed to load sessions.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [user, supabase]);

  // --- Event Handlers --- 
  const handleLeaveReviewClick = (session: FetchedSession) => {
    setSessionToReview(session);
    setIsReviewModalOpen(true);
  };
  
  const handleViewDetailsClick = (session: FetchedSession) => {
    setSelectedSession(session);
    setIsDetailModalOpen(true);
  };

  const handleReviewSubmit = async (sessionId: string, rating: number, comment: string) => {
    if (!user || !sessionToReview?.tutor_id) {
        setError("Cannot submit review: User or tutor information missing.");
        return;
    }
    console.log("Submitting review...", { sessionId, rating, comment });
    try {
        const { error: reviewError } = await supabase
            .from('reviews')
            .insert({
                student_id: user.id,
                tutor_id: sessionToReview.tutor_id,
                session_id: sessionId,
                rating: rating,
                comment: comment
            });
        
        if (reviewError) throw reviewError;

        // Optimistic update or refetch
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'completed' /* Assume canReview needs update */ } : s)); // Mark as reviewed (need better state)
        setIsReviewModalOpen(false);
        setSessionToReview(null);
        alert("Review submitted successfully!");

    } catch (err: any) {
        console.error("Error submitting review:", err);
        setError(err.message || "Failed to submit review.");
    }
  };

  // --- Rendering --- 
  if (loading) {
    return <div className="p-6 text-center">Loading sessions...</div>;
  }

  if (error) {
    // Display error state, potentially with a retry option
    return (
      <div className="p-6 space-y-4">
        <p className="text-center text-red-600">Error: {error}</p>
        {/* Optional: Add a button to trigger refetch */}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Sessions</h1>
        <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <CalendarPlus className="mr-2 h-4 w-4" /> Schedule Session
            </Button>
          </DialogTrigger>
          {/* TODO: Implement ScheduleSessionModal content/logic */}
        </Dialog>
      </div>

      {sessions.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">You have no sessions scheduled.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => {
            // Determine if review is possible (placeholder logic)
            const canReview = session.status === 'completed'; // Needs real check against reviews table

            return (
              <Card key={session.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg mb-1">{session.title}</CardTitle>
                      <CardDescription className="text-xs flex items-center gap-1.5">
                        <User className="h-3 w-3"/> {session.profiles?.name ?? 'N/A'}
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
                    {/* Format fetched date strings */}
                    <span>{format(new Date(session.start_time), 'PP')} ({format(new Date(session.start_time), 'p')} - {format(new Date(session.end_time), 'p')})</span>
                  </div>
                  <div className="text-sm flex items-center gap-1.5 text-muted-foreground capitalize">
                     {session.type === 'online' ? <Globe className="h-4 w-4" /> : <Building className="h-4 w-4" />}
                     <span>{session.type}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex-1">
                      {session.status === 'completed' && canReview && (
                         <Button 
                            variant="outline"
                            size="sm" 
                            className="w-full hover:bg-primary hover:text-black cursor-pointer"
                            onClick={() => handleLeaveReviewClick(session)}
                         >
                            <Star className="mr-2 h-4 w-4" /> Leave Review
                         </Button>
                      )}
                      {session.status === 'completed' && !canReview && (
                         <Button variant="outline" size="sm" disabled className="w-full cursor-not-allowed">
                            <CheckCircle className="mr-2 h-4 w-4" /> Review Submitted
                         </Button>
                      )}
                      {session.status !== 'completed' && (
                         <Button variant="secondary" size="sm" className="w-full cursor-not-allowed" disabled>
                            Session {session.status === 'scheduled' ? 'Upcoming' : 'Cancelled'}
                         </Button>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleViewDetailsClick(session)}
                      className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Leave Review Modal */}
      {sessionToReview && sessionToReview.profiles && (
        <LeaveReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          targetUser={{
             id: sessionToReview.tutor_id,
             name: sessionToReview.profiles.name ?? 'Tutor',
             avatar: sessionToReview.profiles.avatar_url ?? '',
             role: "TUTOR"
          }}
          onSubmit={(rating, reviewText) => {
            handleReviewSubmit(sessionToReview.id, rating, reviewText);
          }}
        />
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <SessionDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          // Pass the fetched session data - ensure modal props match
          session={selectedSession} 
        />
      )}
      {/* TODO: Schedule Session Modal implementation */}
    </div>
  );
} 

