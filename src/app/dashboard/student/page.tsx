"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, GraduationCap, BookOpen } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";

interface StudentStats {
  completedSessions: number;
  studyHours: number;
  averageScore: number;
}

const mockStats: StudentStats = {
  completedSessions: 24,
  studyHours: 36,
  averageScore: 85,
};

const weeklyStudyData = [
  { day: "Mon", hours: 2, score: 85 },
  { day: "Tue", hours: 3, score: 90 },
  { day: "Wed", hours: 4, score: 88 },
  { day: "Thu", hours: 2, score: 82 },
  { day: "Fri", hours: 3, score: 87 },
  { day: "Sat", hours: 1.5, score: 85 },
  { day: "Sun", hours: 1, score: 84 },
];

const subjectScores = [
  { subject: "Math", score: 88 },
  { subject: "Physics", score: 85 },
  { subject: "Chemistry", score: 82 },
  { subject: "Biology", score: 86 },
];

export default function StudentDashboardPage() {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-teal-50 to-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 text-transparent bg-clip-text">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your learning progress
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-none shadow-lg hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-700">
              Completed Sessions
            </CardTitle>
            <Clock className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-900">{mockStats.completedSessions}</div>
            <p className="text-xs text-teal-600">
              Sessions attended
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-coral-50 to-rose-50 border-none shadow-lg hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-coral-700">
              Study Hours
            </CardTitle>
            <BookOpen className="h-4 w-4 text-coral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-coral-900">{mockStats.studyHours}</div>
            <p className="text-xs text-coral-600">
              Total hours
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-none shadow-lg hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Average Score
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{mockStats.averageScore}%</div>
            <p className="text-xs text-purple-600">
              Overall performance
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-lg hover:shadow-xl transition-all bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-medium bg-gradient-to-r from-teal-600 to-cyan-600 text-transparent bg-clip-text">
              Weekly Study Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyStudyData}>
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
                    tickFormatter={(value) => `${value}h`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  <defs>
                    <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#0d9488"
                    fill="url(#studyGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-all bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-medium bg-gradient-to-r from-coral-600 to-rose-600 text-transparent bg-clip-text">
              Scores by Subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectScores}>
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
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff7f50" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#e11d48" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <Bar
                    dataKey="score"
                    fill="url(#scoreGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 