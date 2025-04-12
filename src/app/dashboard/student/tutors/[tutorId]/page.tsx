'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth, UserProfile } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Star, MapPin, GraduationCap } from 'lucide-react'; // Import necessary icons

// Interface for tutor profile data
interface TutorProfileData extends UserProfile {
    // Add specific tutor fields if any (e.g., bio, subjects taught)
    bio?: string;
    subjects?: string[]; // Assuming subjects might be stored directly or fetched separately
}

// Interface for review data including student name
interface ReviewData {
    id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    profiles: Pick<UserProfile, 'name'> | null; // Student's profile (just name needed)
}

export default function TutorProfilePage() {
  const params = useParams();
  const tutorId = params.tutorId as string;
  const { user: studentUser } = useAuth(); // Logged-in student
  const supabase = createClient();

  const [profile, setProfile] = useState<TutorProfileData | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  // Add state for sessions, subjects etc. if needed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!tutorId || !studentUser) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        // Fetch tutor profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*') // Fetch all columns for now, refine later
          .eq('id', tutorId)
          .eq('role', 'TUTOR') // Ensure it's a tutor profile
          .single();
        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch reviews for this tutor, joining with student profiles
        const { data: reviewData, error: reviewError } = await supabase
          .from('reviews')
          .select(`
            id, rating, comment, created_at,
            profiles!reviews_student_id_fkey ( name ) 
          `)
          .eq('tutor_id', tutorId)
          .order('created_at', { ascending: false })
          .limit(10); // Limit reviews displayed
        if (reviewError) throw reviewError;
        setReviews(reviewData || []);

        // TODO: Fetch subjects, average rating calculation etc. if needed

      } catch (err: any) {
        console.error("Error fetching tutor details:", err);
        if (err.code === 'PGRST116' && err.message.includes('profiles')) {
            setError("Tutor profile not found or user is not a tutor.");
        } else {
            setError(err.message || "Failed to load tutor details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tutorId, studentUser, supabase]);

  if (loading) {
    return <div className="p-6 text-center">Loading tutor profile...</div>;
  }

  if (error || !profile) {
    return <div className="p-6 text-center text-red-600">Error: {error || 'Tutor profile not found.'}</div>;
  }
  
  // Calculate average rating (simple example)
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Avatar className="h-20 w-20 border">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || 'Tutor'} />
          <AvatarFallback>{profile.name?.split(' ').map(n => n[0]).join('') || 'T'}</AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold">{profile.name || 'Tutor Profile'}</h1>
          {/* Display Average Rating */}
          {averageRating > 0 && (
            <div className="flex items-center justify-center sm:justify-start gap-1 text-lg text-muted-foreground mt-1">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span>{averageRating.toFixed(1)}</span>
              <span className="text-sm">({reviews.length} reviews)</span>
            </div>
          )}
           {averageRating === 0 && (
             <p className="text-sm text-muted-foreground mt-1">No reviews yet</p>
           )}
        </div>
         {/* Add Schedule/Contact buttons here? */}
      </div>

      {/* About Section */}
      <Card>
          <CardHeader><CardTitle>About</CardTitle></CardHeader>
          <CardContent>
             <p className="text-muted-foreground">{profile.bio || 'No bio available.'}</p>
          </CardContent>
      </Card>
      
      {/* Subjects Section - TODO: Fetch real subjects */}
      <Card>
          <CardHeader><CardTitle>Subjects Taught</CardTitle></CardHeader>
          <CardContent>
             {profile.subjects && profile.subjects.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {profile.subjects.map(subject => (
                        <Badge key={subject} variant="secondary">{subject}</Badge>
                    ))}
                </div>
             ) : (
                 <p className="text-muted-foreground">No subjects listed.</p>
             )}
             {/* Placeholder if subjects aren't in profile table */}
              {!profile.subjects && <p className="text-muted-foreground">Subject data not available.</p>}
          </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-muted-foreground">This tutor has no reviews yet.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map(review => (
                <li key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                       {/* Display stars based on rating */} 
                       {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                       ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {format(new Date(review.created_at), 'PP')}
                    </span>
                  </div>
                   {review.comment && <p className="text-sm mb-1">{review.comment}</p>}
                   <p className="text-xs text-muted-foreground">By: {review.profiles?.name ?? 'Student'}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

    </div>
  );
} 