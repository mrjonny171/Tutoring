"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScheduleSessionModal } from "@/components/scheduling/schedule-session-modal";
import { CalendarPlus, User, Star, MapPin, GraduationCap, CheckCircle } from "lucide-react";
import Link from "next/link";
import { LeaveReviewModal, UserInfo } from "@/components/modals/leave-review-modal";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define FetchedTutor interface based on assumed RPC result
interface FetchedTutor {
  id: string;
  name: string;
  avatar_url: string | null; // Match profile schema
  subjects: string[] | null; // Match profile schema
  bio: string | null; // Match profile schema
  rating: number; // Assuming RPC calculates/returns this
  has_completed_session: boolean;
  has_submitted_review: boolean;
}

// Mock Data (replace with actual data fetching)
// const mockTutors: Tutor[] = [ ... ]; // Removed mock data

// --- TutorCard Component ---
interface TutorCardProps {
  tutor: FetchedTutor; // Use FetchedTutor
  onScheduleClick: (tutor: FetchedTutor) => void;
  onReviewClick: (tutor: FetchedTutor) => void;
  canReview: boolean; // Add eligibility flag
  reviewDisabledReason: string; // Add reason for tooltip
}

function TutorCard({ tutor, onScheduleClick, onReviewClick, canReview, reviewDisabledReason }: TutorCardProps) {
  return (
    <Link key={tutor.id} href={`/dashboard/student/tutors/${tutor.id}`} className="block h-full"> {/* Ensure link takes full height */}
      <Card
        className="h-full flex flex-col overflow-hidden transition-shadow duration-200 ease-in-out hover:shadow-xl" // Removed cursor-pointer as Link provides it
      >
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4 relative">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={tutor.avatar_url || undefined} alt={tutor.name || 'Tutor'} /> {/* Use avatar_url */}
            <AvatarFallback>{tutor.name?.split(' ').map(n => n[0]).join('') || 'T'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle>{tutor.name || 'Unnamed Tutor'}</CardTitle> {/* Add fallback */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span>{tutor.rating.toFixed(1)}</span>
              {/* Optionally add review count if available */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-medium">Subjects</h4>
            <div className="flex flex-wrap gap-1">
              {tutor.subjects && tutor.subjects.length > 0 ? (
                  tutor.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary">{subject}</Badge>
                  ))
              ) : (
                  <span className="text-xs text-muted-foreground">No subjects listed</span>
              )}
            </div>
          </div>
          <CardDescription className="text-sm text-muted-foreground line-clamp-3">
            {tutor.bio || 'No bio available.'} {/* Use bio */}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center pt-4">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* Wrap button in a span for tooltip to work when disabled */}
                  <span tabIndex={0} className={`flex-1 ${!canReview ? 'cursor-not-allowed' : ''}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`w-full ${!canReview ? 'pointer-events-none' : 'cursor-pointer'}`} // Use w-full for flex item
                      onClick={(e) => {
                        if (canReview) {
                          e.preventDefault(); // Prevent link navigation
                          onReviewClick(tutor);
                        }
                      }}
                      disabled={!canReview}
                      aria-disabled={!canReview}
                    >
                      <Star className="mr-2 h-4 w-4" /> Leave Review
                    </Button>
                  </span>
                </TooltipTrigger>
                {!canReview && (
                  <TooltipContent>
                    <p>{reviewDisabledReason}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          <Button size="sm" className="flex-1 cursor-pointer" onClick={(e) => { e.preventDefault(); onScheduleClick(tutor); }}>
            <CalendarPlus className="mr-2 h-4 w-4" /> Schedule
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

// --- Main Page Component ---
export default function StudentTutorsPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [tutors, setTutors] = useState<FetchedTutor[]>([]); // State for tutors
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedTutorForScheduling, setSelectedTutorForScheduling] = useState<FetchedTutor | null>(null); // Use FetchedTutor
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedTutorForReview, setSelectedTutorForReview] = useState<UserInfo | null>(null);

  // Fetch tutors and eligibility data
  const fetchTutors = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc('get_tutors_for_student', {
        student_uuid: user.id,
      });

      if (rpcError) {
          // Handle specific RPC errors if needed, e.g., function not found
          console.error("RPC Error:", rpcError);
          throw new Error(`Failed to fetch tutors: ${rpcError.message}`);
      }
      
      if (!data) {
           console.warn("No tutor data returned from RPC.");
           setTutors([]);
      } else {
          // Explicitly cast if necessary, ensure the data matches FetchedTutor
          setTutors(data as FetchedTutor[]); 
      }

    } catch (err: any) {
      console.error("Error fetching tutor data:", err);
      setError(err.message || "An unexpected error occurred while fetching tutors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, [user, supabase]); // Dependency on user and supabase

  const handleScheduleClick = (tutor: FetchedTutor) => { // Use FetchedTutor
    // Map FetchedTutor to the format expected by ScheduleSessionModal if needed
    setSelectedTutorForScheduling(tutor);
    setIsScheduleModalOpen(true);
  };

  const handleOpenReviewModal = (tutor: FetchedTutor) => { // Use FetchedTutor
    setSelectedTutorForReview({ // Prepare UserInfo for the modal
      id: tutor.id,
      name: tutor.name || 'Tutor',
      avatar: tutor.avatar_url || '', // Provide fallback
      role: "TUTOR"
    });
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (rating: number, reviewText: string) => { // Make async
    if (!selectedTutorForReview || !user) {
        console.error("No tutor selected or user not logged in for review submission.");
        // Optionally show an error to the user
        return;
    }
    console.log(`Submitting review for ${selectedTutorForReview?.name}: Rating ${rating}, Text: ${reviewText}`);
    try {
        const { error: insertError } = await supabase
            .from('reviews')
            .insert({
                student_id: user.id,
                tutor_id: selectedTutorForReview.id,
                rating: rating,
                comment: reviewText || null, // Handle empty string
            });
        
        if (insertError) throw insertError;

        console.log("Review submitted successfully!");
        // Optionally show a success message

        // Refetch tutors to update the review button state
        fetchTutors();

    } catch (err: any) {
        console.error("Error submitting review:", err);
        // Optionally show an error message to the user
    } finally {
        setIsReviewModalOpen(false);
        setSelectedTutorForReview(null); // Clear selection
    }
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
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find a Tutor</h1> {/* Updated Title */}
        <p className="text-muted-foreground">Browse available tutors and schedule a session.</p>
      </div>

      {loading && <div className="text-center p-6">Loading tutors...</div>}
      {error && <div className="text-center p-6 text-red-600">Error: {error}</div>}

      {!loading && !error && tutors.length === 0 && (
        <div className="text-center p-6 text-muted-foreground">No tutors found.</div>
      )}

      {!loading && !error && tutors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tutors.map((tutor) => {
              const canReview = tutor.has_completed_session && !tutor.has_submitted_review;
              let reviewDisabledReason = "";
              if (!tutor.has_completed_session) {
                  reviewDisabledReason = "Complete at least one session with this tutor to leave a review.";
              } else if (tutor.has_submitted_review) {
                  reviewDisabledReason = "You have already reviewed this tutor.";
              }

              return (
                <TutorCard
                  key={tutor.id}
                  tutor={tutor}
                  onScheduleClick={handleScheduleClick}
                  onReviewClick={handleOpenReviewModal}
                  canReview={canReview}
                  reviewDisabledReason={reviewDisabledReason}
                />
              );
            })}
          </div>
       )}

      {/* Scheduling Modal - Adapt props if needed based on FetchedTutor vs Tutor */}
      {selectedTutorForScheduling && (
        <ScheduleSessionModal
          isOpen={isScheduleModalOpen}
          onClose={handleScheduleClose}
          role="STUDENT"
          // Assuming ScheduleSessionModal expects an array of UserInfo-like objects
           availableUsers={[{ id: selectedTutorForScheduling.id, name: selectedTutorForScheduling.name || 'Tutor', avatar: selectedTutorForScheduling.avatar_url || '', role: 'TUTOR' }]}
          preSelectedUserId={selectedTutorForScheduling.id}
        />
      )}

      {/* Review Modal */}
      {selectedTutorForReview && (
          <LeaveReviewModal
            isOpen={isReviewModalOpen}
            onClose={handleReviewClose}
            targetUser={selectedTutorForReview}
            onSubmit={handleReviewSubmit} // Pass the updated async handler
          />
      )}
    </div>
  );
} 