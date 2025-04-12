"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, GraduationCap } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

interface SessionData {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  student_id: string;
}

interface DashboardState {
  totalSessions: number;
  hoursTutored: number;
  activeStudents: number;
  weeklyActivityData: { day: string; hours: number }[];
  hoursBySubjectData: { subject: string; hours: number }[];
}

export default function TutorDashboardPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [dashboardData, setDashboardData] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data: sessions, error: sessionsError } = await supabase
          .from('sessions')
          .select('id, start_time, end_time, status, student_id')
          .eq('tutor_id', user.id);

        if (sessionsError) {
          throw sessionsError;
        }

        let completedCount = 0;
        let totalTutoredHours = 0;
        const studentSet = new Set<string>();
        const weeklyHoursMap: { [key: string]: number } = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        sessions?.forEach(session => {
          studentSet.add(session.student_id);
          if (session.status === 'completed') {
            completedCount++;
            const start = new Date(session.start_time);
            const end = new Date(session.end_time);
            const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            totalTutoredHours += durationHours;

            const dayOfWeek = days[start.getDay()];
            if (dayOfWeek) {
              weeklyHoursMap[dayOfWeek] += durationHours;
            }
          }
        });

        const processedWeeklyData = Object.entries(weeklyHoursMap).map(([day, hours]) => ({ day, hours: parseFloat(hours.toFixed(1)) }));

        const placeholderSubjectHours = [
          { subject: "Math", hours: 24 }, { subject: "Physics", hours: 18 },
        ];

        setDashboardData({
          totalSessions: completedCount,
          hoursTutored: parseFloat(totalTutoredHours.toFixed(1)),
          activeStudents: studentSet.size,
          weeklyActivityData: processedWeeklyData,
          hoursBySubjectData: placeholderSubjectHours,
        });

      } catch (err: any) {
        console.error("Error fetching tutor dashboard data:", err);
        setError(err.message || "Failed to load dashboard data.");
      } finally {
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
          Welcome back! Here's an overview of your tutoring activity
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              Sessions completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hours Tutored
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.hoursTutored}</div>
            <p className="text-xs text-muted-foreground">
              Total hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.activeStudents}</div>
            <p className="text-xs text-muted-foreground">
              Current students
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity (Hours)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.weeklyActivityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/> 
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '4px'}} 
                    labelStyle={{ fontWeight: 'bold' }} 
                    itemStyle={{ color: '#333' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#8B5CF6"
                  fillOpacity={1} 
                  fill="url(#colorActivity)"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 1, fill: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 2, fill: '#8B5CF6' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hours by Subject</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.hoursBySubjectData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis
                  dataKey="subject"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '4px'}} 
                    labelStyle={{ fontWeight: 'bold' }} 
                    itemStyle={{ color: '#333' }}
                />
                <Bar 
                  dataKey="hours" 
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 