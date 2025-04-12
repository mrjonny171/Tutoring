"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ExerciseCardProps {
  exercise: {
    id: string;
    title: string;
    subject: string;
    difficulty: string;
    status: string;
    description: string;
    questions: string[];
    dueDate: Date;
  };
}

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

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const handleStartExercise = async (exerciseId: string) => {
    console.log("Starting exercise:", exerciseId);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {exercise.title}
              <Badge variant="secondary">{exercise.subject}</Badge>
            </CardTitle>
            <div className="mt-2 flex gap-2">
              <Badge className={getDifficultyColor(exercise.difficulty)}>
                {exercise.difficulty}
              </Badge>
              <Badge className={getStatusColor(exercise.status)}>
                {exercise.status.replace("_", " ")}
              </Badge>
            </div>
          </div>
          <Button
            variant={exercise.status === "COMPLETED" ? "outline" : "default"}
            disabled={exercise.status === "COMPLETED"}
            onClick={() => handleStartExercise(exercise.id)}
          >
            {exercise.status === "COMPLETED"
              ? "Completed"
              : exercise.status === "IN_PROGRESS"
              ? "Continue"
              : "Start"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {exercise.description}
          </p>
          <div>
            <h4 className="font-medium mb-2">Questions:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {exercise.questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </div>
          <div className="text-sm text-muted-foreground">
            Due: {new Date(exercise.dueDate).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 