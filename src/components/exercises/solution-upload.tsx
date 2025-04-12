"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, CheckCircle } from "lucide-react";

interface SolutionUploadProps {
  exerciseId: string;
  exerciseTitle: string;
  onUpload: (solution: {
    exerciseId: string;
    explanation: string;
    file: File;
  }) => void;
}

export function SolutionUpload({ exerciseId, exerciseTitle, onUpload }: SolutionUploadProps) {
  const [explanation, setExplanation] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    onUpload({
      exerciseId,
      explanation,
      file,
    });

    // Reset form
    setExplanation("");
    setFile(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Solution</CardTitle>
        <p className="text-sm text-muted-foreground">
          Uploading solution for: {exerciseTitle}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="explanation">Solution Explanation</Label>
            <Textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain your solution approach"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Solution File</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            <CheckCircle className="mr-2 h-4 w-4" />
            Upload Solution
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 