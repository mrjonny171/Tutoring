"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper";
import { Clock, Users, GraduationCap } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";

interface TutorStats {
  totalSessions: number;
  hoursTutored: number;
  activeStudents: number;
}

const mockStats: TutorStats = {
  totalSessions: 48,
  hoursTutored: 72,
  activeStudents: 12,
};

const weeklyData = [
  { day: "Mon", sessions: 4, hours: 6 },
  { day: "Tue", sessions: 6, hours: 9 },
  { day: "Wed", sessions: 8, hours: 12 },
  { day: "Thu", sessions: 4, hours: 6 },
  { day: "Fri", sessions: 6, hours: 9 },
  { day: "Sat", sessions: 3, hours: 4.5 },
  { day: "Sun", sessions: 2, hours: 3 },
];

const subjectData = [
  { subject: "Math", hours: 24 },
  { subject: "Physics", hours: 18 },
  { subject: "Chemistry", hours: 16 },
  { subject: "Biology", hours: 14 },
];

export default function TutorDashboardPage() {
  return (
    <DashboardWrapper>
      <div className="p-6 space-y-6">
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
              <div className="text-2xl font-bold">{mockStats.totalSessions}</div>
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
              <div className="text-2xl font-bold">{mockStats.hoursTutored}</div>
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
              <div className="text-2xl font-bold">{mockStats.activeStudents}</div>
              <p className="text-xs text-muted-foreground">
                Current students
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
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
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="hours"
                      stroke="#adfa1d"
                      fill="rgba(173, 250, 29, 0.2)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Hours by Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectData}>
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
                      tickFormatter={(value) => `${value}h`}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="hours"
                      fill="#adfa1d"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardWrapper>
  );
} 