"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageSquare, Calendar, ChevronDown, ChevronUp, Star, TrendingUp, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScheduleSessionModal } from "@/components/scheduling/schedule-session-modal";

// Define Student interface based on usage (adjust if needed)
interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subjects: string[];
  sessionsCompleted: number;
  upcomingSessions: number;
  averageRating: number;
  lastSession: string;
  status: string;
  progress: number;
  attendanceRate: number;
  performance: { subject: string, score: number }[];
  sessionHistory: { date: string, duration: number, topic: string }[];
}

// Mock data for demonstration
const mockStudents: Student[] = [
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

// Placeholder for actual tutor data
const mockTutor = {
  id: "tutor123",
  name: "Current Tutor Name", // Replace with actual tutor name
  // Add other necessary tutor fields if the modal requires them
};

export default function TutorStudentsPage() {
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedStudentForScheduling, setSelectedStudentForScheduling] = useState<Student | null>(null);

  const toggleStudent = (studentId: string) => {
    const newExpanded = new Set(expandedStudents);
    if (newExpanded.has(studentId)) {
      newExpanded.delete(studentId);
    } else {
      newExpanded.add(studentId);
    }
    setExpandedStudents(newExpanded);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement invite logic
    console.log("Inviting student with email:", inviteEmail);
    setInviteEmail("");
    setIsInviteModalOpen(false);
  };

  const handleScheduleClick = (student: Student) => {
    setSelectedStudentForScheduling(student);
    setIsScheduleModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Students</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search students..." className="pl-8" />
          </div>
          <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">Invite Student</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite a Student</DialogTitle>
                <DialogDescription>
                  Enter the student's email address to send them an invitation.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="cursor-pointer">Send Invitation</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {mockStudents.map((student) => (
              <div key={student.id}>
                <div 
                  className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => toggleStudent(student.id)}
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {student.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{student.progress}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{student.averageRating}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{student.upcomingSessions} upcoming</span>
                    </div>
                    {expandedStudents.has(student.id) ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                {expandedStudents.has(student.id) && (
                  <div className="p-4 bg-muted/30 transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-muted-foreground">Subjects</h4>
                        <div className="flex flex-wrap gap-2">
                          {student.subjects.map((subject) => (
                            <Badge key={subject} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-background cursor-pointer" 
                          onClick={() => handleScheduleClick(student)} 
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Session
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedStudentForScheduling && (
        <ScheduleSessionModal
          isOpen={isScheduleModalOpen}
          onClose={() => {
            setIsScheduleModalOpen(false);
            setSelectedStudentForScheduling(null);
          }}
          role="TUTOR"
          availableUsers={[selectedStudentForScheduling]}
          preSelectedUserId={selectedStudentForScheduling.id}
        />
      )}
    </div>
  );
} 