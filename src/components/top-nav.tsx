"use client";

import { Button } from "@/components/ui/button";
// import { useSession } from "next-auth/react"; // Remove next-auth
import Link from "next/link";
// import { RoleSwitcher } from "./role-switcher"; // Remove RoleSwitcher
import { useAuth } from "@/context/AuthContext"; // Import our custom hook
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading
import { useRouter } from 'next/navigation'; // Import useRouter

export function TopNav() {
  // Use our custom Auth context
  const { user, profile, signOut, loading } = useAuth();
  const router = useRouter(); // Get router instance

  // Create async handler for sign out + redirect
  const handleSignOut = async () => {
    try {
      await signOut(); // Call the signOut function from context
      router.push('/'); // Redirect to root page after sign out
    } catch (error) {
        console.error("Sign out error:", error);
        // Optionally show an error message to the user
    }
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-50"> {/* Added bg, sticky, top, z-index */}
      <div className="container mx-auto flex h-16 items-center px-4"> {/* Use container for centering */}
        <div className="flex items-center space-x-4 mr-6"> {/* Added margin right */} 
          {/* Consider adding a logo/icon here */}
      
        </div>

        {/* Authentication Status */} 
        <div className="ml-auto flex items-center space-x-4">
          {loading ? (
            // Show skeletons while loading auth state
            <>
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </>
          ) : user ? (
            // User is logged in - Show name and Sign Out
            <>
              <span className="text-sm font-medium text-muted-foreground">
                 Hi, {profile?.name?.split(' ')[0] || 'User'}! {/* Show first name */} 
              </span>
              {/* Optional: Add Avatar */}
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback>{profile?.name?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            // User is logged out - Show Sign In and Register
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 