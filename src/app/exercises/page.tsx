"use client";

import { ExerciseUpload } from "@/components/exercises/exercise-upload";
import { SolutionUpload } from "@/components/exercises/solution-upload";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { UserRole } from "@prisma/client";

interface Exercise {
  id: string;
  title: string;
  description: string;
  price: number;
  file: File;
  solution?: {
    file: File;
    explanation: string;
  };
}

interface UploadedExercise {
  title: string;
  description: string;
  price: number;
  file: File;
}

// Mock data for demonstration
const mockExercises: Exercise[] = [
  {
    id: "1",
    title: "Calculus Problem Set",
    description: "A set of calculus problems covering derivatives and integrals",
    price: 5.99,
    file: new File([], "calculus.pdf"),
    solution: {
      file: new File([], "calculus_solution.pdf"),
      explanation: "Detailed step-by-step solutions for all problems"
    }
  },
  {
    id: "2",
    title: "Physics Kinematics",
    description: "Problems on motion, velocity, and acceleration",
    price: 4.99,
    file: new File([], "physics.pdf")
  }
];

export default function ExercisesPage() {
  const { data: session } = useSession();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);

  const userRole = session?.user?.role;

  const handleExerciseUpload = async (exercise: UploadedExercise) => {
    // TODO: Implement exercise upload logic
    const newExercise: Exercise = {
      id: Date.now().toString(),
      ...exercise
    };
    setExercises([...exercises, newExercise]);
  };

  const handleSolutionUpload = async (solution: {
    exerciseId: string;
    explanation: string;
    file: File;
  }) => {
    // TODO: Implement solution upload logic
    setExercises(exercises.map(ex => {
      if (ex.id === solution.exerciseId) {
        return {
          ...ex,
          solution: {
            file: solution.file,
            explanation: solution.explanation
          }
        };
      }
      return ex;
    }));
    setSelectedExercise(null);
  };

  const handleDownloadSolution = (exercise: Exercise) => {
    if (!exercise.solution) return;
    // TODO: Implement actual file download
    console.log("Downloading solution:", exercise.solution);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Exercises</h1>
      
      {userRole === "STUDENT" ? (
        <div className="space-y-8">
          <ExerciseUpload onUpload={handleExerciseUpload} />
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">My Exercises</h2>
            <div className="grid gap-4">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="border rounded-lg p-4">
                  <h3 className="font-medium">{exercise.title}</h3>
                  <p className="text-sm text-muted-foreground">{exercise.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-medium">€{exercise.price.toFixed(2)}</span>
                    {exercise.solution && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadSolution(exercise)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Solution
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : userRole === "TUTOR" ? (
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Available Exercises</h2>
            <div className="grid gap-4">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="border rounded-lg p-4">
                  <h3 className="font-medium">{exercise.title}</h3>
                  <p className="text-sm text-muted-foreground">{exercise.description}</p>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedExercise(exercise)}
                    >
                      {exercise.solution ? "Update Solution" : "Add Solution"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedExercise && (
            <SolutionUpload
              exerciseId={selectedExercise.id}
              exerciseTitle={selectedExercise.title}
              onUpload={handleSolutionUpload}
            />
          )}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          Please sign in to access exercises
        </div>
      )}
    </div>
  );
} 