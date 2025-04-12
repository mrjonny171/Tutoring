"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, Tag, Clock, User, FileCheck } from "lucide-react";
import { UploadSolutionModal } from "@/components/modals/upload-solution-modal";
import { useAuth, UserProfile } from '@/context/AuthContext'; // Import useAuth
import { createClient } from '@/lib/supabase/client'; // Import Supabase client
import { format } from 'date-fns'; // Import date-fns

// Database enum type for Exercise Status
type ExerciseStatusDB = 'new' | 'in_progress' | 'solved' | 'cancelled';

// Define the shape of the exercise data fetched from Supabase for Tutor
interface FetchedExercise {
  id: string;
  title: string;
  subject: string | null;
  price: number;
  status: ExerciseStatusDB;
  submitted_at: string; // Timestamp string
  request_file_name: string | null;
  solution_file_name: string | null;
  student_id: string;
  profiles: Pick<UserProfile, 'name'> | null; // Nested student profile (only name needed)
  // Add description if needed by modals/logic
  description?: string;
  request_file_url?: string;
  solution_file_url?: string;
}

// Type for filtering, including 'all'
type ExerciseFilterStatus = ExerciseStatusDB | 'all';

// Helper to map DB status to display text/variant
const getStatusVariant = (status: ExerciseStatusDB): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case 'new': return 'secondary'; 
    case 'in_progress': return 'outline'; 
    case 'solved': return 'default'; 
    case 'cancelled': return 'destructive'; 
    default: return 'secondary';
  }
};

const formatStatusDisplay = (status: ExerciseStatusDB): string => {
    return status.replace('_', ' '); // Replace underscores
};

export default function TutorExercisesPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [exercises, setExercises] = useState<FetchedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ExerciseFilterStatus>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedExerciseForUpload, setSelectedExerciseForUpload] = useState<FetchedExercise | null>(null);

  // --- Data Fetching --- 
  useEffect(() => {
    const fetchExercises = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Base query: select exercises and join with student profiles
        let query = supabase
          .from('exercises')
          .select(`
            id,
            title,
            subject,
            description, 
            price,
            status,
            submitted_at,
            request_file_name,
            solution_file_name,
            student_id,
            profiles ( name ),
            request_file_url,
            solution_file_url
          `)
          .order('submitted_at', { ascending: false });

        // Filter logic: Show 'new' OR exercises assigned to this tutor
        // This uses Supabase OR filter
        query = query.or(`status.eq.new,tutor_id.eq.${user.id}`);

        const { data, error: exercisesError } = await query;

        if (exercisesError) throw exercisesError;
        setExercises(data || []);

      } catch (err: any) {
        console.error("Error fetching tutor exercises:", err);
        setError(err.message || "Failed to load exercises.");
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [user, supabase]);

  // --- Event Handlers (Placeholders/Updates) --- 
  const handleOpenUploadModal = (exercise: FetchedExercise) => {
    setSelectedExerciseForUpload(exercise);
    setIsUploadModalOpen(true);
  };

  // Update signature to accept the solution file
  const handleUploadSubmit = async (exerciseId: string, solutionFile: File | undefined) => {
    if (!user) {
      setError("You must be logged in.");
      return;
    }
    if (!selectedExerciseForUpload) {
      setError("Cannot submit solution: No exercise selected.");
      return;
    }

    const currentStatus = selectedExerciseForUpload.status;
    
    // Require file only if uploading for 'in_progress' exercise
    if (currentStatus === 'in_progress' && !solutionFile) {
        setError("Please select a solution file to upload.");
        return;
    }

    setLoading(true); // Use page loading state
    setError(null);

    try {
      let updateData: Partial<FetchedExercise> & { status: ExerciseStatusDB; tutor_id?: string; solved_at?: string } = { 
          status: 'in_progress', // Default status change
          tutor_id: user.id // Assign tutor unconditionally on action
      };
      let filePath: string | null = null;

      // --- Handle 'in_progress' -> 'solved' state (Upload required) --- 
      if (currentStatus === 'in_progress' && solutionFile) {
        // 1. Upload the solution file
        const fileExt = solutionFile.name.split('.').pop();
        const uniqueFileName = `${user.id}_${exerciseId}_${Date.now()}.${fileExt}`;
        filePath = `solutions/${uniqueFileName}`; // Store in a 'solutions' folder

        const { error: uploadError } = await supabase.storage
            .from('exercise_files') // Same bucket as requests
            .upload(filePath, solutionFile);

        if (uploadError) {
            console.error("Solution Upload Error:", uploadError);
            throw new Error(`Failed to upload solution file: ${uploadError.message}`);
        }
        
        // Prepare DB update data for solved state
        updateData = {
            ...updateData, // Keep tutor_id assignment
            status: 'solved',
            solution_file_name: solutionFile.name,
            solution_file_url: filePath,
            solved_at: new Date().toISOString(),
        };
      }
      // --- Handle 'new' -> 'in_progress' state (No upload needed) --- 
      else if (currentStatus === 'new') {
         // updateData already has status: 'in_progress' and tutor_id set
         console.log("Accepting exercise:", exerciseId);
      } else {
         // Should not happen if button logic is correct
         throw new Error(`Cannot process exercise with status: ${currentStatus}`);
      }

      // 2. Update the exercise record in the database
      const { error: updateError } = await supabase
          .from('exercises')
          .update(updateData)
          .eq('id', exerciseId);

      if (updateError) {
          console.error("DB Update Error:", updateError);
          // Attempt cleanup if upload happened
          if (filePath) {
            // await supabase.storage.from('exercise_files').remove([filePath]);
          }
          throw new Error(`Failed to update exercise: ${updateError.message}`);
      }

      // 3. Success - Close modal and refetch exercises
      alert(`Exercise successfully ${currentStatus === 'new' ? 'accepted' : 'updated'}!`);
      setIsUploadModalOpen(false);
      setSelectedExerciseForUpload(null);
      
      // Refetch the list to show changes
      const { data: updatedExercises, error: refetchError } = await supabase
        .from('exercises')
        .select(`id, title, subject, description, price, status, submitted_at, request_file_name, solution_file_name, student_id, profiles ( name ), request_file_url, solution_file_url`)
        .or(`status.eq.new,tutor_id.eq.${user.id}`)
        .order('submitted_at', { ascending: false });
      
      if (refetchError) throw refetchError;
      setExercises(updatedExercises || []);

    } catch (err: any) {
        console.error("Error handling exercise update/upload:", err);
        setError(err.message || "An unexpected error occurred.");
        // Keep modal open on error?
    } finally {
        setLoading(false);
    }
  };

  // Updated handler for downloading the request file
  const handleRequestDownload = async (filePath: string | null, fileName: string | null) => {
    if (!filePath || !fileName) {
      setError("File path or name is missing.");
      return;
    }
    setError(null);
    try {
      const { data: blob, error: downloadError } = await supabase.storage
        .from('exercise_files')
        .download(filePath);

      if (downloadError) throw new Error(`Failed to download request file: ${downloadError.message}`);

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err: any) {
      console.error("Download failed:", err);
      setError(err.message || "Could not download the file.");
      alert(`Error: ${err.message || "Could not download the file."}`);
    }
  };

  // Updated handler for downloading solution files
  const handleSolutionDownload = async (filePath: string | null, fileName: string | null) => {
     if (!filePath || !fileName) {
      setError("Solution file path or name is missing.");
      return;
    }
    setError(null);
     try {
      const { data: blob, error: downloadError } = await supabase.storage
        .from('exercise_files') 
        .download(filePath);

      if (downloadError) throw new Error(`Failed to download solution file: ${downloadError.message}`);

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err: any) {
      console.error("Download failed:", err);
      setError(err.message || "Could not download the file.");
      alert(`Error: ${err.message || "Could not download the file."}`);
    }
  };

  // --- Filtering --- 
  const filteredExercises = exercises.filter(
    (exercise) => filterStatus === 'all' || exercise.status === filterStatus
  );

  // --- Rendering --- 
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-semibold">Exercises Assigned</h1>
        {/* Filter Buttons - Use DB status values */}
        <div className="flex items-center gap-2 flex-wrap">
            <Button variant={filterStatus === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus('all')} className="cursor-pointer">All</Button>
            <Button variant={filterStatus === 'new' ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus('new')} className="cursor-pointer">New</Button>
            <Button variant={filterStatus === 'in_progress' ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus('in_progress')} className="cursor-pointer">In Progress</Button>
            <Button variant={filterStatus === 'solved' ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus('solved')} className="cursor-pointer">Solved</Button>
            <Button variant={filterStatus === 'cancelled' ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus('cancelled')} className="cursor-pointer">Cancelled</Button>
        </div>
      </div>

      {/* Exercises List - Conditional Rendering */}
      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading exercises...</p>
      ) : error ? (
        <p className="text-center text-red-600 py-8">Error loading exercises: {error}</p>
      ) : (
        <div className="border rounded-lg">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <div key={exercise.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b last:border-b-0 gap-4">
                {/* Left Side: Details */}
                <div className="flex-1 space-y-1">
                   <h3 className="font-semibold text-base">{exercise.title}</h3>
                   <div className="text-sm text-muted-foreground flex items-center flex-wrap gap-x-3 gap-y-1">
                      {exercise.subject && <span>{exercise.subject}</span>}
                      <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" /> €{exercise.price?.toFixed(2) ?? 'N/A'}
                      </span>
                      <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Submitted: {format(new Date(exercise.submitted_at), 'PP')} {/* Format date */}
                      </span>
                      {exercise.profiles?.name && (
                          <span className="flex items-center gap-1">
                             <User className="h-3 w-3" /> Requested by: {exercise.profiles.name}
                          </span>
                      )}
                   </div>
                </div>
                {/* Right Side: Status & Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                   <Badge variant={getStatusVariant(exercise.status)} className="capitalize min-w-[90px] text-center justify-center">
                      {formatStatusDisplay(exercise.status)} {/* Format status display */}
                   </Badge>
                   <div className="flex items-center gap-2"> 
                      {/* Update onClick to pass file path and name */}
                      {exercise.request_file_name && exercise.status !== 'cancelled' && (
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRequestDownload(exercise.request_file_url, exercise.request_file_name)}
                              title={`Download request file (${exercise.request_file_name})`}
                              className="cursor-pointer"
                              disabled={!exercise.request_file_url} // Disable if no URL
                          >
                              <Download className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Request</span>
                          </Button>
                      )}
                      {/* Upload/Accept Solution Button (Conditional) */}
                      {(exercise.status === 'new' || exercise.status === 'in_progress') && (
                          <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleOpenUploadModal(exercise)} // Opens modal, needs logic to accept/assign tutor
                              title="Accept & Upload Solution" 
                              className="cursor-pointer"
                          >
                              <Upload className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">{exercise.status === 'new' ? 'Accept' : 'Upload Solution'}</span>
                          </Button>
                      )}
                      {/* Update onClick to pass file path and name */}
                      {/* Download Solution Button (Conditional) */}
                      {exercise.status === 'solved' && exercise.solution_file_name && (
                          <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleSolutionDownload(exercise.solution_file_name)}
                              title={`Download solution file (${exercise.solution_file_name})`}
                              className="cursor-pointer"
                          >
                              <FileCheck className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Solution</span>
                          </Button>
                      )}
                   </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground p-8">
              {filterStatus === 'all' ? 'There are no exercises available or assigned to you.' : 'No exercises match the current filter.'}
            </p>
          )}
        </div>
      )}

      {/* Upload Solution Modal */}
      {selectedExerciseForUpload && (
        <UploadSolutionModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSubmit={handleUploadSubmit} // Pass the implemented handler
          exercise={selectedExerciseForUpload} 
        />
      )}
    </div>
  );
} 