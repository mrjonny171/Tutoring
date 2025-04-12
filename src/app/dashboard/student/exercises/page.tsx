"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Plus } from "lucide-react";
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper";
import { SubmitExerciseModal } from "@/components/modals/submit-solution-modal";
import { CreateExerciseModal } from "@/components/modals/create-exercise-modal";

interface Exercise {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  hasSubmitted: boolean;
}

const mockExercises: Exercise[] = [
  {
    id: "1",
    title: "Calculus Problem Set",
    subject: "Mathematics",
    dueDate: "2024-03-20",
    hasSubmitted: false,
  },
  {
    id: "2",
    title: "Physics Practice Problems",
    subject: "Physics",
    dueDate: "2024-03-22",
    hasSubmitted: true,
  },
];

export default function StudentExercisesPage() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const handleSubmitExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsSubmitModalOpen(true);
  };

  return (
    <DashboardWrapper>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Exercises</h1>
            <p className="text-muted-foreground">
              View and submit your exercises
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Exercise
          </Button>
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
                        <span>{exercise.hasSubmitted ? "Submitted" : "Not submitted"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => handleSubmitExercise(exercise)}
                        variant={exercise.hasSubmitted ? "outline" : "default"}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {exercise.hasSubmitted ? "Update Submission" : "Submit Exercise"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <SubmitExerciseModal
          isOpen={isSubmitModalOpen}
          onClose={() => {
            setIsSubmitModalOpen(false);
            setSelectedExercise(null);
          }}
          exercise={selectedExercise}
        />

        <CreateExerciseModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </DashboardWrapper>
  );
} 