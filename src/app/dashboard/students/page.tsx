"use client";

import { DashboardWrapper } from "@/components/layout/dashboard-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageSquare, Calendar, BookOpen, Star, TrendingUp, Clock, Award } from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

// Mock data for demonstration
const mockStudents = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/avatars/john-doe.png",
    subjects: ["Mathematics", "Physics"],
    sessionsCompleted: 12,
    upcomingSessions: 2,
    averageRating: 4.8,
    lastSession: "2024-03-15",
    status: "active",
    progress: 85,
    attendanceRate: 95,
    performance: [
      { subject: "Mathematics", score: 92 },
      { subject: "Physics", score: 88 }
    ],
    sessionHistory: [
      { date: "2024-03-15", duration: 60, topic: "Calculus" },
      { date: "2024-03-12", duration: 90, topic: "Mechanics" }
    ]
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "/avatars/jane-smith.png",
    subjects: ["Chemistry", "Biology"],
    sessionsCompleted: 8,
    upcomingSessions: 1,
    averageRating: 4.9,
    lastSession: "2024-03-14",
    status: "active",
    progress: 78,
    attendanceRate: 100,
    performance: [
      { subject: "Chemistry", score: 85 },
      { subject: "Biology", score: 90 }
    ],
    sessionHistory: [
      { date: "2024-03-14", duration: 60, topic: "Organic Chemistry" },
      { date: "2024-03-10", duration: 90, topic: "Cell Biology" }
    ]
  }
];

const StudentsPage = () => {
  return (
    <DashboardWrapper>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Students</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-8" />
            </div>
            <Button asChild>
              <Link href="/dashboard/sessions/schedule">
                Schedule New Session
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {mockStudents.map((student) => (
            <Card key={student.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                      <div className="flex gap-2 mt-2">
                        {student.subjects.map((subject) => (
                          <Badge key={subject} variant="secondary">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={student.status === "active" ? "default" : "secondary"}>
                      {student.status}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{student.averageRating}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Performance Analytics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Overall Progress</p>
                          <p className="font-semibold">{student.progress}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Attendance Rate</p>
                          <p className="font-semibold">{student.attendanceRate}%</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={student.performance}>
                          <XAxis dataKey="subject" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Bar dataKey="score" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Recent Sessions</h4>
                    <div className="space-y-4">
                      {student.sessionHistory.map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{session.topic}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(session.date).toLocaleDateString()} • {session.duration} min
                            </p>
                          </div>
                          <Award className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/sessions/schedule?studentId=${student.id}`}>
                      Schedule Session
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/students/${student.id}`}>
                      View Detailed Analytics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default StudentsPage; 