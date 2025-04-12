"use client";

import { useState, useEffect } from 'react';
// NOTE: DashboardWrapper should be handled by the layout file
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, Clock, User, Circle, MessageSquare, Star, Globe, Building, Eye } from "lucide-react";
import { format } from 'date-fns';
import { ScheduleSessionModal } from "@/components/scheduling/schedule-session-modal";
import Link from "next/link";
import { SessionDetailModal } from "@/components/modals/session-detail-modal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useAuth, UserProfile } from '@/context/AuthContext'; // Import useAuth and UserProfile
import { createClient } from '@/lib/supabase/client'; // Import Supabase client

// Define the shape of the session data fetched from Supabase
// Including related student profile data
interface FetchedSession {
  id: string;
  title: string;
  start_time: string; // Timestamps are strings initially
  end_time: string;
  type: "presential" | "online";
  status: "scheduled" | "completed" | "cancelled";
  student_id: string;
  profiles: UserProfile | null; // Nested student profile data
  // Add other fields as needed by modals
}

export default function TutorSessionsPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [sessions, setSessions] = useState<FetchedSession[]>([]);
  const [availableStudents, setAvailableStudents] = useState<UserProfile[]>([]); // For scheduling modal
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<FetchedSession | null>(null);

  // --- Data Fetching --- 
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Fetch sessions for this tutor, joining with student profiles
        const { data: sessionData, error: sessionsError } = await supabase
          .from('sessions')
          .select(`
            id,
            title,
            start_time,
            end_time,
            type,
            status,
            student_id,
            profiles!inner(*) 
          `)
          .eq('tutor_id', user.id)
          .order('start_time', { ascending: false }); 

        if (sessionsError) throw sessionsError;
        setSessions(sessionData || []);

        // Fetch all student profiles for the scheduling modal
        const { data: studentProfiles, error: studentsError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'STUDENT');
          
        if (studentsError) throw studentsError;
        setAvailableStudents(studentProfiles || []);

      } catch (err: any) {
        console.error("Error fetching tutor sessions/students:", err);
        setError(err.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, supabase]);

  // --- Event Handlers --- 
  const handleViewDetailsClick = (session: FetchedSession) => {
    setSelectedSession(session);
    setIsDetailModalOpen(true);
  };
  
  // Define expected data structure from the modal
  interface ScheduleFormData {
    studentId: string;
    startDate: Date; // Combined date and start time
    endDate: Date; // Combined date and end time
    title: string;
    type: 'online' | 'presential';
    joinUrl?: string;
  }

  // Implement the scheduling submission logic
  const handleScheduleSubmit = async (formData: ScheduleFormData) => {
    if (!user) {
        setError("You must be logged in to schedule a session.");
        return;
    }
    
    setLoading(true); // Use page loading state
    setError(null);

    try {
        const sessionData = {
            student_id: formData.studentId,
            tutor_id: user.id, // Current user is the tutor
            title: formData.title,
            start_time: formData.startDate.toISOString(), // Convert dates to ISO strings for DB
            end_time: formData.endDate.toISOString(),
            type: formData.type,
            status: 'scheduled' as const, // Explicitly set status
            join_url: formData.type === 'online' ? formData.joinUrl : null, // Only relevant for online
        };

        const { error: insertError } = await supabase
            .from('sessions')
            .insert(sessionData);

        if (insertError) {
            console.error("Session Insert Error:", insertError);
            throw new Error(`Failed to schedule session: ${insertError.message}`);
        }

        // Success: Close modal, refetch, show message
        alert("Session scheduled successfully!");
        setIsScheduleModalOpen(false);

        // Refetch sessions
        const { data: updatedSessions, error: refetchError } = await supabase
          .from('sessions')
          .select(`id, title, start_time, end_time, type, status, student_id, profiles!inner(*) `)
          .eq('tutor_id', user.id)
          .order('start_time', { ascending: false }); 
        
        if (refetchError) throw refetchError;
        setSessions(updatedSessions || []);

    } catch (err: any) {
        console.error("Error scheduling session:", err);
        setError(err.message || "An unexpected error occurred while scheduling.");
    } finally {
        setLoading(false);
    }
  };

  // --- Rendering --- 
  if (loading) {
    return <div className="p-6 text-center">Loading sessions...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    // Explicitly NO DashboardWrapper here
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Sessions</h1>
          <p className="text-muted-foreground">View and manage your upcoming and past sessions.</p>
        </div>
        <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <CalendarPlus className="mr-2 h-4 w-4" /> Schedule Session
            </Button>
          </DialogTrigger>
          {/* Pass availableStudents and handle submit to the modal */}
          <ScheduleSessionModal
            isOpen={isScheduleModalOpen}
            onClose={() => setIsScheduleModalOpen(false)}
            role="TUTOR"
            availableUsers={availableStudents} 
            onSubmit={handleScheduleSubmit} // Pass the implemented handler
          />
        </Dialog>
      </div>

      {/* Conditional Rendering for Sessions List */}
      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading sessions...</p>
      ) : error ? (
        <p className="text-center text-red-600 py-8">Error loading sessions: {error}</p>
      ) : sessions.length === 0 ? (
         <p className="text-center text-muted-foreground py-8">You have no sessions scheduled.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"> {/* Adjusted gap */}
          {sessions.map((session) => (
            <Card 
              key={session.id} 
              className="flex flex-col hover:shadow-lg transition-shadow duration-200" // Removed translate-y
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-1">{session.title}</CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1.5">
                      <User className="h-3 w-3"/> {session.profiles?.name ?? 'N/A'} {/* Use profile name */}
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
                  <span>{format(new Date(session.start_time), 'PP')} ({format(new Date(session.start_time), 'p')} - {format(new Date(session.end_time), 'p')})</span>
                </div>
                <div className="text-sm flex items-center gap-1.5 text-muted-foreground capitalize">
                  {session.type === 'online' ? <Globe className="h-4 w-4" /> : <Building className="h-4 w-4" />}
                  <span>{session.type}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-4 flex justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewDetailsClick(session)}
                  className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                >
                  <Eye className="h-4 w-4 mr-2" /> View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
       )}
      
      {/* Session Detail Modal */}
      {selectedSession && (
          <SessionDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            session={selectedSession} // Pass fetched session data
          />
      )}
      {/* Schedule Modal is already handled within the Dialog Trigger */}
    </div>
  );
} 