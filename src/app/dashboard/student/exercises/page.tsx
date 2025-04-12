"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Plus, Tag, Clock, Filter, UserCheck, FileCheck } from "lucide-react";
import { CreateExerciseModal } from "@/components/modals/create-exercise-modal";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface Exercise {
  id: string;
  title: string;
  subject: string;
  description?: string;
  price: number;
  status: "pending" | "solved" | "cancelled";
  submittedDate: string;
  fileName: string;
  solvedByTutor?: {
    id: string;
    name: string;
  };
  solutionFileName?: string;
}

type ExerciseStatus = Exercise['status'] | 'all';

const mockExercises: Exercise[] = [
  {
    id: "1",
    title: "Calculus Problem Set",
    subject: "Mathematics",
    price: 15.00,
    status: "solved",
    submittedDate: "2024-03-18",
    fileName: "calculus_problems.pdf",
    solvedByTutor: { id: "t1", name: "Dr. Smith" },
    solutionFileName: "calculus_problems_solution.pdf",
  },
  {
    id: "2",
    title: "Physics Practice Problems",
    subject: "Physics",
    price: 20.50,
    status: "pending",
    submittedDate: "2024-03-20",
    fileName: "physics_questions.pdf",
  },
  {
    id: "3",
    title: "Chemistry Lab Report Analysis",
    subject: "Chemistry",
    price: 10.00,
    status: "pending",
    submittedDate: "2024-03-21",
    fileName: "chem_lab_report.docx",
  },
  {
    id: "exr4",
    title: "Literary Analysis Essay Outline",
    subject: "Literature",
    price: 5.00,
    status: "solved",
    submittedDate: "2024-03-22",
    fileName: "essay_outline_prompt.txt",
    solvedByTutor: { id: "t3", name: "Ms. Davis" },
    solutionFileName: "essay_outline_solution.docx",
  },
];

const getStatusVariant = (status: Exercise['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'pending': return 'default';
    case 'solved': return 'secondary';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
};

export default function StudentExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ExerciseStatus>('all');

  const handleCreateExerciseSubmit = (title: string, description: string, subject: string, price: number, file: File) => {
    const newExercise: Exercise = {
      id: crypto.randomUUID(),
      title,
      description,
      subject,
      price,
      status: "pending",
      submittedDate: new Date().toISOString().split('T')[0],
      fileName: file.name,
    };
    setExercises(prevExercises => [newExercise, ...prevExercises]);
    console.log("New Exercise Request Submitted:", newExercise);
    setIsCreateModalOpen(false);
  };

  const handleDownloadClick = (fileName: string) => {
    console.log(`Attempting to download file: ${fileName}`);
    alert(`Download simulation: ${fileName}`);
  };

  const handleSolutionDownloadClick = (solutionFileName: string | undefined) => {
    if (!solutionFileName) return;
    console.log(`Attempting to download solution file: ${solutionFileName}`);
    alert(`Download simulation: ${solutionFileName}`);
  };

  const filteredExercises = exercises.filter(exercise => 
    filterStatus === 'all' || exercise.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-semibold">My Exercises</h1>
        <div className="flex items-center gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" /> Create Exercise
              </Button>
            </DialogTrigger>
          </Dialog>
          <div className="flex items-center gap-2">
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
        </div>
      </div>

      <div className="border rounded-lg">
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise) => (
            <div key={exercise.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b last:border-b-0 gap-4">
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
                  {exercise.status === 'solved' && exercise.solvedByTutor && (
                     <span className="flex items-center gap-1 text-green-600 dark:text-green-500">
                        <UserCheck className="h-3 w-3" /> Solved by: {exercise.solvedByTutor.name}
                     </span>
                 )}
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                 <Badge variant={getStatusVariant(exercise.status)} className="capitalize">
                    {exercise.status}
                 </Badge>
                 <div className="flex items-center gap-2"> 
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadClick(exercise.fileName)}
                        title={`Download request file (${exercise.fileName})`}
                        className="cursor-pointer"
                    >
                        <Download className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Request</span>
                    </Button>
                    {exercise.status === 'solved' && exercise.solutionFileName && (
                        <Button 
                            variant="secondary"
                            size="sm"
                            onClick={() => handleSolutionDownloadClick(exercise.solutionFileName)}
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

      <CreateExerciseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateExerciseSubmit}
      />
    </div>
  );
} 