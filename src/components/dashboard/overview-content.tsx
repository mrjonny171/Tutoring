"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Activity, Book, Clock, GraduationCap, Target, Trophy, Users } from "lucide-react";

interface TutorStats {
  totalSessions: number;
  sessionsTrend: string;
  hoursTutored: number;
  hoursTrend: string;
  activeStudents: number;
  studentsTrend: string;
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
  sessionData: Array<{ name: string; sessions: number }>;
  subjectData: Array<{ name: string; hours: number }>;
  stats: TutorStats;
}

interface StudentData {
  sessionData: Array<{ name: string; hours: number }>;
  subjectData: Array<{ name: string; progress: number }>;
  stats: StudentStats;
}

interface OverviewContentProps {
  userRole: "tutor" | "student";
}

const mockTutorData: TutorData = {
  stats: {
    totalSessions: 48,
    sessionsTrend: "+12%",
    hoursTutored: 96,
    hoursTrend: "+8%",
    activeStudents: 15,
    studentsTrend: "+20%",
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
    sessionsTrend: "+8%",
    studyHours: 48,
    hoursTrend: "+15%",
    averageScore: 85,
    scoreTrend: "+5%",
    materials: 18,
    materialsTrend: "+10%"
  },
  sessionData: [
    { name: "Mon", hours: 2 },
    { name: "Tue", hours: 3 },
    { name: "Wed", hours: 4 },
    { name: "Thu", hours: 2 },
    { name: "Fri", hours: 5 },
    { name: "Sat", hours: 6 },
    { name: "Sun", hours: 2 }
  ],
  subjectData: [
    { name: "Math", progress: 75 },
    { name: "Physics", progress: 65 },
    { name: "Chemistry", progress: 80 },
    { name: "Biology", progress: 70 }
  ]
};

export function OverviewContent({ userRole }: OverviewContentProps) {
  const data = userRole === "tutor" ? mockTutorData : mockStudentData;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {userRole === "tutor" ? (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTutorData.stats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">{mockTutorData.stats.sessionsTrend} from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Tutored</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTutorData.stats.hoursTutored}</div>
              <p className="text-xs text-muted-foreground">{mockTutorData.stats.hoursTrend} from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTutorData.stats.activeStudents}</div>
              <p className="text-xs text-muted-foreground">{mockTutorData.stats.studentsTrend} from last month</p>
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
              <div className="text-2xl font-bold">{mockStudentData.stats.completedSessions}</div>
              <p className="text-xs text-muted-foreground">{mockStudentData.stats.sessionsTrend} from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStudentData.stats.studyHours}</div>
              <p className="text-xs text-muted-foreground">{mockStudentData.stats.hoursTrend} from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStudentData.stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">{mockStudentData.stats.scoreTrend} from last month</p>
            </CardContent>
          </Card>
        </>
      )}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Study Materials</CardTitle>
          <Book className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.stats.materials}</div>
          <p className="text-xs text-muted-foreground">{data.stats.materialsTrend} from last month</p>
        </CardContent>
      </Card>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>{userRole === "tutor" ? "Sessions Overview" : "Study Hours"}</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.sessionData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar
                dataKey={userRole === "tutor" ? "sessions" : "hours"}
                fill="#adfa1d"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
} 