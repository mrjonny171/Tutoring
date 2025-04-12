"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// This page acts as a router based on the authenticated user's role.
export default function DashboardRedirectPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect until loading is finished and we have profile info
    if (!loading && profile) {
      if (profile.role === 'STUDENT') {
        router.replace('/dashboard/student'); // Use replace to avoid adding to history
      } else if (profile.role === 'TUTOR') {
        router.replace('/dashboard/tutor');
      } else {
        // Handle unexpected role or error - maybe redirect to login?
        console.error("User has unexpected role:", profile.role);
        // router.replace('/login'); // Or show an error message
      }
    } else if (!loading && !profile) {
      // Handle case where user is somehow past middleware but has no profile (error)
      console.error("No profile found after loading.");
      // router.replace('/login'); // Redirect to login as a fallback
    }
  }, [profile, loading, router]);

  // Display a loading state while determining the role and redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading dashboard...</p>
      {/* Optional: Add a spinner component here */}
    </div>
  );
} 