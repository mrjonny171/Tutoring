"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, GraduationCap, BookOpen } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

interface SessionData {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
}

interface ExerciseData {
    id: string;
    subject: string;
    status: string;
    score: number | null;
}

interface DashboardState {
  completedSessions: number;
  studyHours: number;
  averageScore: number;
  weeklyStudyData: { day: string; hours: number }[];
  subjectScoresData: { subject: string; score: number }[];
}

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [dashboardData, setDashboardData] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("StudentDashboard: fetchData started");
      if (!user) {
        console.log("StudentDashboard: No user found, exiting fetchData.");
        setLoading(false);
        return;
      }
      console.log("StudentDashboard: User found, setting loading true.");
      setLoading(true);
      setError(null);

      try {
        console.log("StudentDashboard: Fetching sessions...");
        const { data: sessions, error: sessionsError } = await supabase
          .from('sessions')
          .select('id, start_time, end_time, status')
          .eq('student_id', user.id);

        if (sessionsError) {
          console.error("StudentDashboard: Error fetching sessions:", sessionsError);
          throw sessionsError;
        }
        console.log("StudentDashboard: Sessions fetched:", sessions);

        let completedCount = 0;
        let totalStudyHours = 0;
        const weeklyHoursMap: { [key: string]: number } = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        sessions?.forEach(session => {
          if (session.status === 'completed') {
            completedCount++;
            const start = new Date(session.start_time);
            const end = new Date(session.end_time);
            const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            totalStudyHours += durationHours;

            const dayOfWeek = days[start.getDay()];
            if (dayOfWeek) {
                 weeklyHoursMap[dayOfWeek] += durationHours;
            }
          }
        });
        
        const processedWeeklyData = Object.entries(weeklyHoursMap).map(([day, hours]) => ({ day, hours: parseFloat(hours.toFixed(1)) }));
        console.log("StudentDashboard: Session metrics calculated.");

        console.log("StudentDashboard: Fetching exercises...");
        const { data: exercises, error: exercisesError } = await supabase
          .from('exercises')
          .select('subject, score')
          .eq('student_id', user.id)
          .eq('status', 'completed')
          .not('score', 'is', null);

        if (exercisesError) {
            console.error("StudentDashboard: Error fetching exercises:", exercisesError);
            throw exercisesError;
        }
        console.log("StudentDashboard: Exercises fetched:", exercises);

        let totalScore = 0;
        let scoredExercisesCount = 0;
        const subjectScores: { [subject: string]: { total: number; count: number } } = {};

        exercises?.forEach(ex => {
          if (ex.score !== null && ex.subject) {
            totalScore += ex.score;
            scoredExercisesCount++;
            if (!subjectScores[ex.subject]) {
              subjectScores[ex.subject] = { total: 0, count: 0 };
            }
            subjectScores[ex.subject].total += ex.score;
            subjectScores[ex.subject].count++;
          }
        });

        const calculatedAverageScore = scoredExercisesCount > 0 ? Math.round(totalScore / scoredExercisesCount) : 0;

        const calculatedSubjectScoresData = Object.entries(subjectScores).map(([subject, data]) => ({
          subject,
          score: Math.round(data.total / data.count),
        }));
        console.log("StudentDashboard: Score metrics calculated.");

        console.log("StudentDashboard: Setting dashboard data...");
        setDashboardData({
          completedSessions: completedCount,
          studyHours: parseFloat(totalStudyHours.toFixed(1)),
          averageScore: calculatedAverageScore,
          weeklyStudyData: processedWeeklyData,
          subjectScoresData: calculatedSubjectScoresData,
        });
        console.log("StudentDashboard: Dashboard data set.");

      } catch (err: any) {
        console.error("StudentDashboard: Error in fetchData try block:", err);
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        console.log("StudentDashboard: fetchData finally block reached, setting loading false.");
        setLoading(false);
      }
    };

    fetchData();
  }, [user, supabase]);

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard data...</div>; 
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div className="p-6 text-center">No dashboard data available.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your learning progress.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.completedSessions}</div>
            <p className="text-xs text-muted-foreground">Sessions attended</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.studyHours}</div>
            <p className="text-xs text-muted-foreground">Total hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Based on completed exercises</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Weekly Study Hours</CardTitle></CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.weeklyStudyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs><linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/><YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`}/><Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '4px'}} labelStyle={{ fontWeight: 'bold' }} itemStyle={{ color: '#333' }}/><Area type="monotone" dataKey="hours" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorStudy)" strokeWidth={2} dot={{ r: 4, strokeWidth: 1, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 2, fill: '#8B5CF6' }}/>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Scores by Subject (%)</CardTitle></CardHeader>
          <CardContent className="pl-2">
            {dashboardData.subjectScoresData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.subjectScoresData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="subject" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/><YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`}/><Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '4px'}} labelStyle={{ fontWeight: 'bold' }} itemStyle={{ color: '#333' }} formatter={(value: number) => `${value}%`}/><Bar dataKey="score" fill="#8B5CF6" radius={[4, 4, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <p className="text-sm text-muted-foreground text-center py-10">No scored exercises found to display subject breakdown.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 