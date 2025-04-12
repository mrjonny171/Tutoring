"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScheduleSessionModal } from "@/components/scheduling/schedule-session-modal";
import { CalendarPlus, User, Star } from "lucide-react";
import Link from "next/link";
import { LeaveReviewModal, UserInfo } from "@/components/modals/leave-review-modal";

// Define Tutor interface (consider moving to shared types file)
interface Tutor {
  id: string;
  name: string;
  avatar: string;
  subjects: string[];
  bio: string;
  rating: number;
}

// Mock Data (replace with actual data fetching)
const mockTutors: Tutor[] = [
  {
    id: "tutor1",
    name: "Dr. Emily Carter",
    avatar: "/avatars/emily-carter.png",
    subjects: ["Calculus", "Linear Algebra"],
    bio: "Passionate about making math understandable and engaging.",
    rating: 4.9,
  },
  {
    id: "tutor2",
    name: "Dr. Alan Grant",
    avatar: "/avatars/alan-grant.png",
    subjects: ["Physics", "Astrophysics"],
    bio: "Experienced physicist with a knack for explaining complex concepts.",
    rating: 4.8,
  },
  {
    id: "tutor3",
    name: "Prof. Sarah Harding",
    avatar: "/avatars/sarah-harding.png",
    subjects: ["Chemistry", "Organic Chemistry"],
    bio: "Dedicated to helping students succeed in chemistry.",
    rating: 4.7,
  },
];

// --- TutorCard Component ---
interface TutorCardProps {
  tutor: Tutor;
  onScheduleClick: (tutor: Tutor) => void;
  onReviewClick: (tutor: Tutor) => void;
}

function TutorCard({ tutor, onScheduleClick, onReviewClick }: TutorCardProps) {
  return (
    <Card
      key={tutor.id}
      className="flex flex-col h-full transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1"
    >
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4 relative">
        <Avatar className="h-12 w-12 border">
          <AvatarImage src={tutor.avatar} alt={tutor.name} />
          <AvatarFallback>{tutor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle>{tutor.name}</CardTitle>
          {/* Simple rating display */}
           <div className="flex items-center gap-1 text-sm text-muted-foreground">
             <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
             <span>{tutor.rating.toFixed(1)}</span>
           </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium">Subjects</h4>
          <div className="flex flex-wrap gap-1">
            {tutor.subjects.map((subject) => (
              <Badge key={subject} variant="secondary">{subject}</Badge>
            ))}
          </div>
        </div>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">
          {tutor.bio}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center pt-4">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onReviewClick(tutor)}>
          <Star className="mr-2 h-4 w-4" /> Leave Review
        </Button>
        <Button size="sm" className="flex-1" onClick={(e) => { e.preventDefault(); onScheduleClick(tutor); }}>
          <CalendarPlus className="mr-2 h-4 w-4" /> Schedule
        </Button>
      </CardFooter>
    </Card>
  );
}

// --- Main Page Component ---
export default function StudentTutorsPage() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedTutorForScheduling, setSelectedTutorForScheduling] = useState<Tutor | null>(null); // Renamed for clarity
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedTutorForReview, setSelectedTutorForReview] = useState<UserInfo | null>(null); // Renamed for clarity

  const handleScheduleClick = (tutor: Tutor) => {
    setSelectedTutorForScheduling(tutor);
    setIsScheduleModalOpen(true);
  };

  const handleOpenReviewModal = (tutor: Tutor) => {
    setSelectedTutorForReview({ // Prepare UserInfo for the modal
      id: tutor.id,
      name: tutor.name,
      avatar: tutor.avatar,
      role: "TUTOR"
    });
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = (rating: number, reviewText: string) => {
    console.log(`Review submitted for ${selectedTutorForReview?.name}: Rating ${rating}, Text: ${reviewText}`);
    // TODO: Add API call to submit review
    setIsReviewModalOpen(false);
    setSelectedTutorForReview(null); // Clear selection
  };

  const handleScheduleClose = () => {
     setIsScheduleModalOpen(false);
     setSelectedTutorForScheduling(null); // Clear selection
  }

  const handleReviewClose = () => {
     setIsReviewModalOpen(false);
     setSelectedTutorForReview(null); // Clear selection
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Tutors</h1>
          <p className="text-muted-foreground">Browse available tutors and schedule a session.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockTutors.map((tutor) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              onScheduleClick={handleScheduleClick}
              onReviewClick={handleOpenReviewModal}
            />
          ))}
        </div>
      </div>

      {/* Scheduling Modal */}
      {selectedTutorForScheduling && (
        <ScheduleSessionModal
          isOpen={isScheduleModalOpen}
          onClose={handleScheduleClose} 
          role="STUDENT"
          availableUsers={[selectedTutorForScheduling]} 
          preSelectedUserId={selectedTutorForScheduling.id} 
        />
      )}

      {/* Review Modal */}
      {selectedTutorForReview && (
          <LeaveReviewModal
            isOpen={isReviewModalOpen}
            onClose={handleReviewClose} 
            targetUser={selectedTutorForReview}
            onSubmit={handleReviewSubmit}
          />
      )}
    </>
  );
} 