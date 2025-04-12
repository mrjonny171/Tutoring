"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Plus, Tag, Clock, UserCheck, FileCheck } from "lucide-react";
import { CreateExerciseModal } from "@/components/modals/create-exercise-modal";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useAuth, UserProfile } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';

type ExerciseStatusDB = 'new' | 'in_progress' | 'solved' | 'cancelled';

interface FetchedExercise {
  id: string;
  title: string;
  subject: string | null;
  price: number;
  status: ExerciseStatusDB;
  submitted_at: string;
  request_file_name: string | null;
  solution_file_name: string | null;
  tutor_id: string | null;
  profiles: Pick<UserProfile, 'name'> | null;
}

type ExerciseFilterStatus = ExerciseStatusDB | 'all';

const getStatusVariant = (status: ExerciseStatusDB): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'new': return 'default';
    case 'in_progress': return 'outline';
    case 'solved': return 'secondary';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
};

const formatStatusDisplay = (status: ExerciseStatusDB): string => {
    return status.replace('_', ' ');
};

export default function StudentExercisesPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [exercises, setExercises] = useState<FetchedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ExerciseFilterStatus>('all');

  useEffect(() => {
    const fetchExercises = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { data, error: exercisesError } = await supabase
          .from('exercises')
          .select(`
            id,
            title,
            subject,
            price,
            status,
            submitted_at,
            request_file_name,
            solution_file_name,
            tutor_id,
            profiles ( name ) 
          `)
          .eq('student_id', user.id)
          .order('submitted_at', { ascending: false });

        if (exercisesError) throw exercisesError;
        setExercises(data || []);

      } catch (err: any) {
        console.error("Error fetching student exercises:", err);
        setError(err.message || "Failed to load exercises.");
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [user, supabase]);

  const handleCreateExerciseSubmit = async (title: string, description: string, subject: string, price: number, file: File | undefined) => {
    if (!user) {
        setError("You must be logged in to submit an exercise.");
        return;
    }
    if (!file) {
        setError("A file is required to submit an exercise.");
        return;
    }

    setLoading(true); // Use page loading state for simplicity
    setError(null);

    try {
        // 1. Upload the file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const uniqueFileName = `${user.id}_${Date.now()}.${fileExt}`;
        const filePath = `requests/${uniqueFileName}`; // Store in a 'requests' folder within the bucket

        const { error: uploadError } = await supabase.storage
            .from('exercise_files') // Use the bucket name you created
            .upload(filePath, file);

        if (uploadError) {
            console.error("Storage Upload Error:", uploadError);
            throw new Error(`Failed to upload file: ${uploadError.message}`);
        }

        // 2. Insert exercise data into the database
        const exerciseData = {
            student_id: user.id,
            title: title,
            description: description,
            subject: subject,
            price: price,
            request_file_name: file.name, // Original file name
            request_file_url: filePath,  // Store the path used for upload
            status: 'new' as ExerciseStatusDB, // Set initial status
            // submitted_at is handled by default value in DB
        };

        const { error: insertError } = await supabase
            .from('exercises')
            .insert(exerciseData)
            .select() // Select to potentially get the created record back if needed
            .single(); // Assuming insert returns the single created row

        if (insertError) {
            console.error("DB Insert Error:", insertError);
            // Attempt to clean up the uploaded file if DB insert fails?
            // await supabase.storage.from('exercise_files').remove([filePath]);
            throw new Error(`Failed to create exercise request: ${insertError.message}`);
        }

        // 3. Success - Close modal and refetch or update state
        alert("Exercise request submitted successfully!");
        setIsCreateModalOpen(false);
        // Simple refetch for now:
        const { data: updatedExercises, error: refetchError } = await supabase
            .from('exercises')
            .select(`id, title, subject, price, status, submitted_at, request_file_name, solution_file_name, tutor_id, profiles ( name ) `)
            .eq('student_id', user.id)
            .order('submitted_at', { ascending: false });
        if (refetchError) throw refetchError;
        setExercises(updatedExercises || []);

    } catch (err: any) {
        console.error("Error submitting exercise:", err);
        setError(err.message || "An unexpected error occurred.");
    } finally {
        setLoading(false);
    }
  };

  const handleDownloadClick = async (filePath: string | null, fileName: string | null) => {
    if (!filePath || !fileName) {
      setError("File path or name is missing.");
      return;
    }
    setError(null);
    try {
      console.log(`Attempting download from path: ${filePath}`);
      const { data: blob, error: downloadError } = await supabase.storage
        .from('exercise_files') // Your bucket name
        .download(filePath);

      if (downloadError) {
        console.error("Download Error:", downloadError);
        throw new Error(`Failed to download file: ${downloadError.message}`);
      }

      // Trigger browser download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // Use original file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up

    } catch (err: any) {
      console.error("Download failed:", err);
      setError(err.message || "Could not download the file.");
      alert(`Error: ${err.message || "Could not download the file."}`); // Show user feedback
    }
  };

  const handleSolutionDownloadClick = async (filePath: string | null, solutionFileName: string | null) => {
    if (!filePath || !solutionFileName) {
      setError("Solution file path or name is missing.");
      return;
    }
    setError(null);
     try {
      console.log(`Attempting download from path: ${filePath}`);
      const { data: blob, error: downloadError } = await supabase.storage
        .from('exercise_files') // Your bucket name
        .download(filePath);

      if (downloadError) {
        console.error("Download Error:", downloadError);
        throw new Error(`Failed to download solution file: ${downloadError.message}`);
      }

      // Trigger browser download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', solutionFileName); // Use original file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up

    } catch (err: any) {
      console.error("Download failed:", err);
      setError(err.message || "Could not download the file.");
      alert(`Error: ${err.message || "Could not download the file."}`); // Show user feedback
    }
  };

  const filteredExercises = exercises.filter(exercise => 
    filterStatus === 'all' || exercise.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-semibold">My Exercises</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" /> Create Exercise
              </Button>
            </DialogTrigger>
            <CreateExerciseModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onSubmit={handleCreateExerciseSubmit}
            />
          </Dialog>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant={filterStatus === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus('all')} className="cursor-pointer">All</Button>
            <Button variant={filterStatus === 'new' ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus('new')} className="cursor-pointer">New</Button>
            <Button variant={filterStatus === 'in_progress' ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus('in_progress')} className="cursor-pointer">In Progress</Button>
            <Button variant={filterStatus === 'solved' ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus('solved')} className="cursor-pointer">Solved</Button>
            <Button variant={filterStatus === 'cancelled' ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus('cancelled')} className="cursor-pointer">Cancelled</Button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading exercises...</p>
      ) : error ? (
        <p className="text-center text-red-600 py-8">Error loading exercises: {error}</p>
      ) : (
        <div className="border rounded-lg">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <div key={exercise.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b last:border-b-0 gap-4">
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-base">{exercise.title}</h3>
                  <div className="text-sm text-muted-foreground flex items-center flex-wrap gap-x-3 gap-y-1">
                    {exercise.subject && <span>{exercise.subject}</span>}
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" /> €{exercise.price?.toFixed(2) ?? 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Submitted: {format(new Date(exercise.submitted_at), 'PP')}
                    </span>
                    {exercise.status === 'solved' && exercise.profiles?.name && (
                       <span className="flex items-center gap-1 text-green-600 dark:text-green-500">
                          <UserCheck className="h-3 w-3" /> Solved by: {exercise.profiles.name}
                       </span>
                   )}
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                   <Badge variant={getStatusVariant(exercise.status)} className="capitalize min-w-[90px] text-center justify-center">
                      {formatStatusDisplay(exercise.status)}
                   </Badge>
                   <div className="flex items-center gap-2"> 
                      {exercise.request_file_name && (
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadClick(exercise.request_file_url, exercise.request_file_name)} 
                            title={`Download request file (${exercise.request_file_name})`}
                            className="cursor-pointer"
                            disabled={!exercise.request_file_url}
                        >
                            <Download className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Request</span>
                        </Button>
                      )}
                      {exercise.status === 'solved' && exercise.solution_file_name && (
                          <Button 
                              variant="secondary"
                              size="sm"
                              onClick={() => handleSolutionDownloadClick(exercise.solution_file_url, exercise.solution_file_name)}
                              title={`Download solution file (${exercise.solution_file_name})`}
                              className="cursor-pointer"
                              disabled={!exercise.solution_file_url}
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
              {filterStatus === 'all' ? 'You have not submitted any exercises yet.' : 'No exercises match the current filter.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
} 