"use client";

import { DashboardWrapper } from "@/components/layout/dashboard-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Book, Clock, DollarSign, Users, Upload, FileText, Target, Trophy } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TutorStats {
  totalSessions: number;
  sessionsTrend: string;
  hoursTutored: number;
  hoursTrend: string;
  activeStudents: number;
  studentsTrend: string;
  earnings: number;
  earningsTrend: string;
  materials: number;
  materialsTrend: string;
}

interface StudentStats {
  completedSessions: number;
  sessionsTrend: string;
  studyHours: number;
  hoursTrend: string;
  averageScore: number;
  scoreTrend: string;
  materials: number;
  materialsTrend: string;
}

interface TutorData {
  stats: TutorStats;
  sessionData: Array<{ name: string; sessions: number }>;
  subjectData: Array<{ name: string; hours: number }>;
}

interface StudentData {
  stats: StudentStats;
  sessionData: Array<{ name: string; hours: number }>;
  subjectData: Array<{ name: string; score: number }>;
}

// Mock data for demonstration
const mockTutorData: TutorData = {
  stats: {
    totalSessions: 48,
    sessionsTrend: "+12%",
    hoursTutored: 96,
    hoursTrend: "+8%",
    activeStudents: 15,
    studentsTrend: "+20%",
    earnings: 1200,
    earningsTrend: "+15%",
    materials: 24,
    materialsTrend: "+15%"
  },
  sessionData: [
    { name: "Mon", sessions: 4 },
    { name: "Tue", sessions: 6 },
    { name: "Wed", sessions: 8 },
    { name: "Thu", sessions: 4 },
    { name: "Fri", sessions: 10 },
    { name: "Sat", sessions: 12 },
    { name: "Sun", sessions: 4 }
  ],
  subjectData: [
    { name: "Math", hours: 24 },
    { name: "Physics", hours: 18 },
    { name: "Chemistry", hours: 16 },
    { name: "Biology", hours: 14 }
  ]
};

const mockStudentData: StudentData = {
  stats: {
    completedSessions: 24,
    sessionsTrend: "+15%",
    studyHours: 48,
    hoursTrend: "+10%",
    averageScore: 85,
    scoreTrend: "+5%",
    materials: 12,
    materialsTrend: "+20%"
  },
  sessionData: [
    { name: "Mon", hours: 2 },
    { name: "Tue", hours: 3 },
    { name: "Wed", hours: 4 },
    { name: "Thu", hours: 2 },
    { name: "Fri", hours: 3 },
    { name: "Sat", hours: 5 },
    { name: "Sun", hours: 2 }
  ],
  subjectData: [
    { name: "Math", score: 90 },
    { name: "Physics", score: 85 },
    { name: "Chemistry", score: 88 },
    { name: "Biology", score: 82 }
  ]
};

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<"STUDENT" | "TUTOR">("TUTOR");
  const data = userRole === "TUTOR" ? mockTutorData : mockStudentData;
  const router = useRouter();

  // Redirect to role-specific dashboard
  useEffect(() => {
    if (userRole === "STUDENT") {
      router.push("/dashboard/student");
    } else {
      router.push("/dashboard/tutor");
    }
  }, [userRole, router]);

  return (
    <DashboardWrapper>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {userRole === "TUTOR" ? "Tutor Dashboard" : "Student Dashboard"}
          </h1>
          {userRole === "TUTOR" && (
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/dashboard/tutor/exercises/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Exercise Solution
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/tutor/documents/upload">
                  <FileText className="mr-2 h-4 w-4 cursor-pointer" />
                  Upload Documents
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {userRole === "TUTOR" ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(data as TutorData).stats.totalSessions}</div>
                  <p className="text-xs text-muted-foreground">{(data as TutorData).stats.sessionsTrend} from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hours Tutored</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(data as TutorData).stats.hoursTutored}</div>
                  <p className="text-xs text-muted-foreground">{(data as TutorData).stats.hoursTrend} from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(data as TutorData).stats.activeStudents}</div>
                  <p className="text-xs text-muted-foreground">{(data as TutorData).stats.studentsTrend} from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{(data as TutorData).stats.earnings}</div>
                  <p className="text-xs text-muted-foreground">{(data as TutorData).stats.earningsTrend} from last month</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(data as StudentData).stats.completedSessions}</div>
                  <p className="text-xs text-muted-foreground">{(data as StudentData).stats.sessionsTrend} from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(data as StudentData).stats.studyHours}</div>
                  <p className="text-xs text-muted-foreground">{(data as StudentData).stats.hoursTrend} from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(data as StudentData).stats.averageScore}%</div>
                  <p className="text-xs text-muted-foreground">{(data as StudentData).stats.scoreTrend} from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Study Materials</CardTitle>
                  <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(data as StudentData).stats.materials}</div>
                  <p className="text-xs text-muted-foreground">{(data as StudentData).stats.materialsTrend} from last month</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>{userRole === "TUTOR" ? "Weekly Sessions" : "Study Hours"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userRole === "TUTOR" ? (data as TutorData).sessionData : (data as StudentData).sessionData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey={userRole === "TUTOR" ? "sessions" : "hours"} fill="#adfa1d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{userRole === "TUTOR" ? "Hours by Subject" : "Scores by Subject"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userRole === "TUTOR" ? (data as TutorData).subjectData : (data as StudentData).subjectData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey={userRole === "TUTOR" ? "hours" : "score"} fill="#adfa1d" radius={[4, 4, 0, 0]} />
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