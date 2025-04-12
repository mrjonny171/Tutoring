'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth, UserProfile } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

// Define interfaces for data specific to this page
// We might need more details than the base UserProfile
interface StudentProfileData extends UserProfile {
    // Add any additional fields specific to student profiles if fetched
}

// Reuse Session/Exercise interfaces or define specific ones if needed
interface StudentSession {
    id: string;
    title: string;
    start_time: string;
    end_time: string;
    status: string;
    type: string;
}

interface StudentExercise {
    id: string;
    title: string;
    subject: string | null;
    status: string;
    price: number;
    submitted_at: string;
}

export default function StudentProfilePage() {
  const params = useParams();
  const studentId = params.studentId as string; // Get student ID from URL
  const { user: tutorUser } = useAuth(); // Get logged-in tutor info
  const supabase = createClient();

  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [sessions, setSessions] = useState<StudentSession[]>([]);
  const [exercises, setExercises] = useState<StudentExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId || !tutorUser) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        // Fetch student profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', studentId)
          .single();
        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch sessions involving this student AND the current tutor
        const { data: sessionData, error: sessionError } = await supabase
          .from('sessions')
          .select('id, title, start_time, end_time, status, type')
          .eq('student_id', studentId)
          .eq('tutor_id', tutorUser.id) // Filter by logged-in tutor
          .order('start_time', { ascending: false })
          .limit(5); // Limit for overview
        if (sessionError) throw sessionError;
        setSessions(sessionData || []);

        // Fetch exercises submitted by this student (maybe filter by assigned tutor?)
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('exercises')
          .select('id, title, subject, status, price, submitted_at')
          .eq('student_id', studentId)
          // Optional: Add .eq('tutor_id', tutorUser.id) if you only want to show those assigned to this tutor
          .order('submitted_at', { ascending: false })
          .limit(5); // Limit for overview
        if (exerciseError) throw exerciseError;
        setExercises(exerciseData || []);

      } catch (err: any) {
        console.error("Error fetching student details:", err);
        setError(err.message || "Failed to load student details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId, tutorUser, supabase]);

  if (loading) {
    return <div className="p-6 text-center">Loading student profile...</div>;
  }

  if (error || !profile) {
    return <div className="p-6 text-center text-red-600">Error: {error || 'Student profile not found.'}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || 'Student'} />
          <AvatarFallback>{profile.name?.split(' ').map(n => n[0]).join('') || 'S'}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{profile.name || 'Student Profile'}</h1>
          {/* Add email or other primary contact info if available/needed */}
          {/* <p className="text-muted-foreground">{profile.email}</p> */}
        </div>
      </div>

      {/* Quick Stats/Info (Example) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions (with you)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Exercises Submitted</CardTitle>
          </CardHeader>
          <CardContent>
             {/* This count is currently limited by fetch limit */}
            <div className="text-2xl font-bold">{exercises.length}</div>
          </CardContent>
        </Card>
        {/* Add more relevant stats if available */}
      </div>

      {/* Recent Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions (with you)</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-muted-foreground">No recent sessions found with this student.</p>
          ) : (
            <ul className="space-y-3">
              {sessions.map(session => (
                <li key={session.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{session.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(session.start_time), 'PPp')} - {format(new Date(session.end_time), 'p')}
                    </p>
                  </div>
                  <Badge variant={session.status === 'completed' ? 'secondary' : 'default'} className="capitalize">
                    {session.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
          {/* Optional: Link to full session history page */}
        </CardContent>
      </Card>

      {/* Recent Exercises List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exercises</CardTitle>
        </CardHeader>
        <CardContent>
           {exercises.length === 0 ? (
            <p className="text-muted-foreground">No recent exercises found for this student.</p>
          ) : (
            <ul className="space-y-3">
              {exercises.map(exercise => (
                <li key={exercise.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{exercise.title} {exercise.subject ? `(${exercise.subject})` : ''}</p>
                    <p className="text-sm text-muted-foreground">
                       Submitted: {format(new Date(exercise.submitted_at), 'PP')} - Price: €{exercise.price?.toFixed(2)}
                    </p>
                  </div>
                  <Badge variant={exercise.status === 'solved' ? 'secondary' : 'default'} className="capitalize">
                    {exercise.status.replace('_', ' ')}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
           {/* Optional: Link to full exercises page */}
        </CardContent>
      </Card>

      {/* Add other sections as needed: Performance Metrics, Documents, etc. */}

    </div>
  );
} 