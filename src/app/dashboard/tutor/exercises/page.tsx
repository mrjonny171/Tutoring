"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadSolutionModal } from "@/components/modals/upload-solution-modal";
import { Download, Edit, Eye, FileText } from "lucide-react";
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper";

interface Exercise {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  submissionsCount: number;
  hasSolution: boolean;
}

const mockExercises: Exercise[] = [
  {
    id: "1",
    title: "Calculus Problem Set",
    subject: "Mathematics",
    dueDate: "2024-03-20",
    submissionsCount: 5,
    hasSolution: true,
  },
  {
    id: "2",
    title: "Physics Practice Problems",
    subject: "Physics",
    dueDate: "2024-03-22",
    submissionsCount: 3,
    hasSolution: false,
  },
];

export default function TutorExercisesPage() {
  const [isUploadSolutionModalOpen, setIsUploadSolutionModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const handleUploadSolution = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsUploadSolutionModalOpen(true);
  };

  return (
    <DashboardWrapper>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Exercises</h1>
          <p className="text-muted-foreground">
            Review student submissions and manage exercise solutions
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Exercises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <h3 className="font-medium">{exercise.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        <span>{exercise.subject}</span>
                        <span className="mx-2">•</span>
                        <span>Due: {exercise.dueDate}</span>
                        <span className="mx-2">•</span>
                        <span>{exercise.submissionsCount} submissions</span>
                        <span className="mx-2">•</span>
                        <span>{exercise.hasSolution ? "Solution uploaded" : "No solution uploaded"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => handleUploadSolution(exercise)}
                        variant={exercise.hasSolution ? "outline" : "default"}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {exercise.hasSolution ? "Update Solution" : "Upload Solution"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <UploadSolutionModal
          isOpen={isUploadSolutionModalOpen}
          onClose={() => {
            setIsUploadSolutionModalOpen(false);
            setSelectedExercise(null);
          }}
          exercise={selectedExercise}
        />
      </div>
    </DashboardWrapper>
  );
} 