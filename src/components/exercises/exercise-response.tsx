"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface ExerciseResponseProps {
  exerciseId: string;
  exerciseTitle: string;
}

export function ExerciseResponse({ exerciseId, exerciseTitle }: ExerciseResponseProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return;

    console.log("Uploading solution for exercise:", exerciseId, selectedFile);
    // Implement actual file upload logic here
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Upload Solution</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="solution"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Upload PDF solution for: {exerciseTitle}
            </label>
            <input
              id="solution"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Button
            type="submit"
            disabled={!selectedFile}
            className="w-full sm:w-auto"
          >
            Upload Solution
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 