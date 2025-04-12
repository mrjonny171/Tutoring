"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Download, FileText, Plus, Tag, Clock, Filter, UserCheck, FileCheck } from "lucide-react";
import { CreateExerciseModal } from "@/components/modals/create-exercise-modal";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Exercise Requests</h1>
          <p className="text-muted-foreground">
            Submit exercises for tutors to solve and track their status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
             variant={filterStatus === 'all' ? 'default' : 'outline'} 
             size="sm"
             onClick={() => setFilterStatus('all')}
           >
             All
           </Button>
          <Button 
             variant={filterStatus === 'pending' ? 'default' : 'outline'} 
             size="sm"
             onClick={() => setFilterStatus('pending')}
           >
             Pending
           </Button>
           <Button 
             variant={filterStatus === 'solved' ? 'default' : 'outline'} 
             size="sm"
             onClick={() => setFilterStatus('solved')}
           >
             Solved
           </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="ml-2">
            <Plus className="mr-2 h-4 w-4" />
            Submit New Request
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{exercise.title}</CardTitle>
                <CardDescription>{exercise.subject}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                {exercise.status === 'solved' && exercise.solvedByTutor && (
                    <div className="text-sm text-muted-foreground flex items-center gap-1 border-t pt-3">
                       <UserCheck className="h-4 w-4 text-green-600" /> Solved by: {exercise.solvedByTutor.name}
                    </div>
                )}
                {exercise.status !== 'solved' && <div className="border-t"></div>}

                <div className={`text-sm text-muted-foreground flex items-center justify-between ${exercise.status !== 'solved' ? 'pt-3' : ''}`}>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> Submitted: {exercise.submittedDate}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-primary">
                    <Tag className="h-4 w-4" /> €{exercise.price.toFixed(2)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3 pb-3 flex flex-wrap items-center justify-between gap-2">
                <Badge variant={getStatusVariant(exercise.status)} className="capitalize">
                  {exercise.status}
                </Badge>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadClick(exercise.fileName)}
                        title={`Download original request file (${exercise.fileName})`}
                    >
                        <Download className="h-4 w-4 mr-2" /> Request
                    </Button>
                    {exercise.status === 'solved' && exercise.solutionFileName && (
                        <Button 
                            variant="secondary"
                            size="sm"
                            onClick={() => handleSolutionDownloadClick(exercise.solutionFileName)}
                            title={`Download solution file (${exercise.solutionFileName})`}
                        >
                            <FileCheck className="h-4 w-4 mr-2" /> Solution
                        </Button>
                    )}
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8 md:col-span-2 lg:col-span-3">
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