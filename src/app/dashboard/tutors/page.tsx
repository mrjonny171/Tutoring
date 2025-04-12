"use client";

import { DashboardWrapper } from "@/components/layout/dashboard-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageSquare, Calendar, BookOpen, Star, Clock, Award, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

// Mock data for demonstration
const mockTutors = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    avatar: "/avatars/sarah-johnson.png",
    subjects: ["Mathematics", "Physics"],
    expertise: "PhD in Physics",
    sessionsCompleted: 12,
    upcomingSessions: 2,
    averageRating: 4.9,
    availability: "Mon-Fri, 9AM-5PM",
    teachingStyle: "Interactive, Problem-solving focused",
    achievements: [
      "10+ years teaching experience",
      "Published researcher",
      "Top-rated tutor"
    ],
    sessionHistory: [
      { date: "2024-03-15", duration: 60, topic: "Calculus", rating: 5 },
      { date: "2024-03-12", duration: 90, topic: "Mechanics", rating: 4 }
    ]
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    email: "michael.chen@example.com",
    avatar: "/avatars/michael-chen.png",
    subjects: ["Chemistry", "Biology"],
    expertise: "PhD in Chemistry",
    sessionsCompleted: 8,
    upcomingSessions: 1,
    averageRating: 4.8,
    availability: "Tue-Sat, 10AM-6PM",
    teachingStyle: "Visual learning, Real-world applications",
    achievements: [
      "15+ years teaching experience",
      "Industry expert",
      "Student success specialist"
    ],
    sessionHistory: [
      { date: "2024-03-14", duration: 60, topic: "Organic Chemistry", rating: 5 },
      { date: "2024-03-10", duration: 90, topic: "Cell Biology", rating: 4 }
    ]
  }
];

export default function TutorsPage() {
  return (
    <DashboardWrapper>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Tutors</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tutors..." className="pl-8" />
            </div>
            <Button asChild>
              <Link href="/dashboard/sessions/schedule">
                Book New Session
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {mockTutors.map((tutor) => (
            <Card key={tutor.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={tutor.avatar} alt={tutor.name} />
                      <AvatarFallback>{tutor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{tutor.name}</h3>
                      <p className="text-sm text-muted-foreground">{tutor.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{tutor.expertise}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {tutor.subjects.map((subject) => (
                          <Badge key={subject} variant="secondary">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{tutor.averageRating}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Teaching Profile</h4>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Teaching Style:</span> {tutor.teachingStyle}</p>
                      <p className="text-sm"><span className="font-medium">Availability:</span> {tutor.availability}</p>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Achievements:</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {tutor.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Recent Sessions</h4>
                    <div className="space-y-4">
                      {tutor.sessionHistory.map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{session.topic}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(session.date).toLocaleDateString()} • {session.duration} min
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{session.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/sessions/schedule?tutorId=${tutor.id}`}>
                      Book Session
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/tutors/${tutor.id}`}>
                      View Tutor Profile
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
} 