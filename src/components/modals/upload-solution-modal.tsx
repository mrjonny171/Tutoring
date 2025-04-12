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
import { Upload } from "lucide-react";

interface Exercise {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  submissionsCount: number;
  hasSolution: boolean;
}

interface UploadSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
}

export function UploadSolutionModal({
  isOpen,
  onClose,
  exercise,
}: UploadSolutionModalProps) {
  if (!exercise) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle file upload
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {exercise.hasSolution ? "Update Solution" : "Upload Solution"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h3 className="font-medium">{exercise.title}</h3>
            <p className="text-sm text-muted-foreground">{exercise.subject}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Solution File</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Upload className="mr-2 h-4 w-4" />
              {exercise.hasSolution ? "Update Solution" : "Upload Solution"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 