"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExerciseResponse } from "./exercise-response";
import { useRef } from "react";

// Mock data for testing
const mockExercises = [
  {
    id: "1",
    title: "Calculus: Derivatives",
    subject: "Mathematics",
    difficulty: "Intermediate",
    dueDate: new Date("2024-03-25"),
    status: "IN_PROGRESS",
    description: "Practice problems on derivatives and their applications.",
    questions: [
      "Find the derivative of f(x) = x² + 3x - 2",
      "Calculate the rate of change at x = 2",
    ],
  },
  {
    id: "2",
    title: "Newton's Laws of Motion",
    subject: "Physics",
    difficulty: "Advanced",
    dueDate: new Date("2024-03-22"),
    status: "NOT_STARTED",
    description: "Problems based on Newton's three laws of motion.",
    questions: [
      "Calculate the force needed to accelerate a 2kg mass at 5 m/s²",
      "Explain the concept of action-reaction pairs",
    ],
  },
  {
    id: "3",
    title: "Chemical Equations",
    subject: "Chemistry",
    difficulty: "Beginner",
    status: "COMPLETED",
    dueDate: new Date("2024-03-15"),
    description: "Balancing chemical equations and stoichiometry.",
    questions: [
      "Balance the equation: H2 + O2 → H2O",
      "Calculate the molar mass of NaHCO3",
    ],
  },
];

function getDifficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "bg-green-500";
    case "intermediate":
      return "bg-yellow-500";
    case "advanced":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-500";
    case "IN_PROGRESS":
      return "bg-blue-500";
    case "NOT_STARTED":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

interface ExercisesContentProps {
  userRole?: "STUDENT" | "TUTOR";
}

export function ExercisesContent({ userRole = "TUTOR" }: ExercisesContentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartExercise = async (exerciseId: string) => {
    console.log("Starting exercise:", exerciseId);
    // Implement actual exercise start logic here
  };

  const handleUploadSolution = async (exerciseId: string, file: File) => {
    console.log("Uploading solution for exercise:", exerciseId, file);
    // Implement actual file upload logic here
  };

  const handleFileChange = (exerciseId: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      await handleUploadSolution(exerciseId, file);
      if (e.target) e.target.value = ''; // Reset file input
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exercises</h1>
        <p className="text-muted-foreground">
          Practice problems and assignments
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {mockExercises.map((exercise) => (
          <Card key={exercise.id} className="flex flex-col">
            <CardHeader>
              <div>
                <CardTitle className="flex flex-wrap items-center gap-2">
                  {exercise.title}
                  <Badge variant="secondary">{exercise.subject}</Badge>
                </CardTitle>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge className={getDifficultyColor(exercise.difficulty)}>
                    {exercise.difficulty}
                  </Badge>
                  <Badge className={getStatusColor(exercise.status)}>
                    {exercise.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-4 flex-1">
                <p className="text-sm text-muted-foreground">
                  {exercise.description}
                </p>
                <div>
                  <h4 className="font-medium mb-2">Questions:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {exercise.questions.map((question, index) => (
                      <li key={index} className="break-words">{question}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-sm text-muted-foreground">
                  Due: {formatDate(exercise.dueDate)}
                </div>
              </div>
              {userRole === "TUTOR" && (
                <div className="mt-4 flex justify-end">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange(exercise.id)}
                    className="hidden"
                    id={`solution-${exercise.id}`}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById(`solution-${exercise.id}`)?.click()}
                  >
                    Upload Solution
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 