"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

interface Exercise {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  hasSubmitted: boolean;
}

interface SubmitExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
}

export function SubmitExerciseModal({
  isOpen,
  onClose,
  exercise,
}: SubmitExerciseModalProps) {
  if (!exercise) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle exercise submission
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {exercise.hasSubmitted ? "Update Exercise Submission" : "Submit Exercise"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="font-medium">{exercise.title}</h3>
            <p className="text-sm text-muted-foreground">{exercise.subject}</p>
            <p className="text-sm text-muted-foreground">Due: {exercise.dueDate}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments (Optional)</Label>
            <Textarea
              id="comments"
              placeholder="Add any comments about your submission..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Exercise File</Label>
            <div className="flex items-center gap-4">
              <Input
                id="file"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                required
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("file")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Select file
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Supported formats: PDF, DOC, DOCX
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Upload className="mr-2 h-4 w-4" />
              {exercise.hasSubmitted ? "Update Submission" : "Submit Exercise"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 