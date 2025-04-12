"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, Tag, Clock, Filter, User, FileCheck } from "lucide-react";
import { UploadSolutionModal } from "@/components/modals/upload-solution-modal";

// --- Define Exercise Interface, Status, and Mock Data --- 
interface Exercise {
    id: string;
    title: string;
    subject: string;
    description?: string; // Optional description
    price: number; // Payout for the tutor
    // Tutor-specific statuses (could differ slightly from student)
    status: 'new' | 'in progress' | 'solved' | 'cancelled'; 
    submittedDate: string;
    fileName: string; // The request file name
    requestedBy: { // Student who requested it
      id: string;
      name: string;
    };
    solutionFileName?: string; // Optional: name of the solution file uploaded by tutor
  }
  
  // Define the status type including 'all' for filtering
  type ExerciseStatus = Exercise['status'] | 'all';
  
  // Mock data for the tutor's view
  const mockExercises: Exercise[] = [
    {
      id: "exr1",
      title: "Calculus Problem Set Revision",
      subject: "Mathematics",
      description: "Review the attached problems and provide detailed solutions.",
      price: 15.00,
      status: "solved", // This one is already solved
      submittedDate: "2024-03-18",
      requestedBy: { id: "s1", name: "Alice Johnson" },
      fileName: "calculus_problems_v2.pdf",
      solutionFileName: "calculus_solution_final.pdf", // Has a solution file
    },
    {
      id: "exr2",
      title: "Physics Practice Problems",
      subject: "Physics",
      description: "Need help solving problems 5-10 attached.",
      price: 20.50,
      status: "new", // This is a new request for the tutor
      submittedDate: "2024-03-20",
      requestedBy: { id: "s1", name: "Alice Johnson" },
      fileName: "physics_questions.pdf",
    },
    {
      id: "exr3",
      title: "Chemistry Lab Report Analysis",
      subject: "Chemistry",
      description: "Analyze the results of the attached lab report and answer the questions.",
      price: 10.00,
      status: "in progress", // Tutor started working on it
      submittedDate: "2024-03-21",
      requestedBy: { id: "s2", name: "Bob Williams" },
      fileName: "chem_lab_report.docx",
    },
    {
      id: "exr5",
      title: "Python Data Structure Task",
      subject: "Computer Science",
      description: "Implement a linked list with insert and delete methods.",
      price: 12.00,
      status: "cancelled", // This request was cancelled
      submittedDate: "2024-03-22",
      requestedBy: { id: "s2", name: "Bob Williams" },
      fileName: "python_ds_task.py",
    },
  ];
// --- End Definitions --- 

// Helper function to determine Badge variant (adjust based on defined statuses)
const getStatusVariant = (status: Exercise['status']): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case 'new':
      return 'secondary'; // Use secondary for new/pending
    case 'in progress':
      return 'outline'; // Outline for in progress
    case 'solved':
      return 'default'; // Default (often green/blue) for solved
    case 'cancelled':
      return 'destructive'; // Destructive (red) for cancelled
    default:
      return 'secondary'; // Fallback
  }
};

export default function TutorExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises); // Assuming mock data source
  const [filterStatus, setFilterStatus] = useState<ExerciseStatus | 'all'>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedExerciseForUpload, setSelectedExerciseForUpload] = useState<Exercise | null>(null);

  // Handler to open the upload modal
  const handleOpenUploadModal = (exercise: Exercise) => {
    setSelectedExerciseForUpload(exercise);
    setIsUploadModalOpen(true);
  };

  // Handler for closing the modal and potentially updating the exercise list
  const handleUploadSubmit = (exerciseId: string, solutionFileName: string) => {
    // In a real app, you'd update the backend and refresh data.
    // For this mock setup, we'll just update the local state.
    setExercises(prevExercises =>
      prevExercises.map(ex =>
        ex.id === exerciseId ? { ...ex, status: 'solved', solutionFileName: solutionFileName } : ex
      )
    );
    setIsUploadModalOpen(false);
    setSelectedExerciseForUpload(null);
    console.log(`Uploaded solution ${solutionFileName} for exercise ${exerciseId}`);
  };

  // Handler for downloading the request file
  const handleRequestDownload = (fileName: string) => {
    // Simulate file download
    console.log(`Downloading request file: ${fileName}`);
    alert(`Simulating download for: ${fileName}`);
  };

  // --- Add handler for downloading solution --- 
  const handleSolutionDownload = (fileName: string | undefined) => {
    if (!fileName) return;
    // Simulate file download
    console.log(`Downloading solution file: ${fileName}`);
    alert(`Simulating download for: ${fileName}`);
  };
  // --- End handler --- 

  // Filtering logic
  const filteredExercises = exercises.filter(
    (exercise) => filterStatus === 'all' || exercise.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Exercises Assigned</h1>
        {/* --- Filter Buttons --- */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
            className="cursor-pointer"
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'new' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('new')}
            className="cursor-pointer"
          >
            New
          </Button>
          <Button
            variant={filterStatus === 'in progress' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('in progress')}
            className="cursor-pointer"
          >
            In Progress
          </Button>
          <Button
            variant={filterStatus === 'solved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('solved')}
            className="cursor-pointer"
          >
            Solved
          </Button>
          <Button
            variant={filterStatus === 'cancelled' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('cancelled')}
            className="cursor-pointer"
          >
            Cancelled
          </Button>
        </div>
        {/* --- End Filter Buttons --- */}
      </div>

      {/* List Container */}
      <div className="border rounded-lg">
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise) => (
            // List Item
            <div key={exercise.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b last:border-b-0 gap-4">
              {/* Left Side: Details */}
              <div className="flex-1 space-y-1">
                 <h3 className="font-semibold text-base">{exercise.title}</h3>
                 <div className="text-sm text-muted-foreground flex items-center flex-wrap gap-x-3 gap-y-1">
                    <span>{exercise.subject}</span>
                    <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" /> €{exercise.price.toFixed(2)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Submitted: {exercise.submittedDate}
                    </span>
                    {exercise.requestedBy && (
                        <span className="flex items-center gap-1">
                           <User className="h-3 w-3" /> Requested by: {exercise.requestedBy.name}
                        </span>
                    )}
                 </div>
              </div>
              {/* Right Side: Status & Actions */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                 <Badge variant={getStatusVariant(exercise.status)} className="capitalize min-w-[90px] text-center justify-center">
                    {exercise.status}
                 </Badge>
                 <div className="flex items-center gap-2"> 
                    {/* Download Request Button (Hide on cancelled) */}
                    {exercise.status !== 'cancelled' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRequestDownload(exercise.fileName)}
                            title={`Download request file (${exercise.fileName})`}
                            className="cursor-pointer"
                        >
                            <Download className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Request</span>
                        </Button>
                    )}
                    {/* Upload Solution Button (Conditional) */}
                    {exercise.status !== 'solved' && exercise.status !== 'cancelled' && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenUploadModal(exercise)}
                            title="Upload solution file"
                            className="cursor-pointer"
                        >
                            <Upload className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Upload Solution</span>
                        </Button>
                    )}
                    {/* Download Solution Button (Conditional) */}
                    {exercise.status === 'solved' && exercise.solutionFileName && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleSolutionDownload(exercise.solutionFileName)}
                            title={`Download solution file (${exercise.solutionFileName})`}
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
            No exercises match the current filter.
          </p>
        )}
      </div>

      {/* Upload Solution Modal */}
      {selectedExerciseForUpload && (
        <UploadSolutionModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSubmit={handleUploadSubmit}
          exercise={selectedExerciseForUpload}
        />
      )}
    </div>
  );
} 