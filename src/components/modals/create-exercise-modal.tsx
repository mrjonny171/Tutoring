"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus } from "lucide-react";

// Mock subjects (replace with actual data if available)
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Literature"];

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, subject: string, price: number, file: File) => void;
}

export function CreateExerciseModal({ isOpen, onClose, onSubmit }: CreateExerciseModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title || !description || !subject || price <= 0 || !file) {
      setError("Please fill in all required fields, set a price > 0, and select a file.");
      return;
    }
    onSubmit(title, description, subject, price, file);
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setSubject("");
    setPrice(0);
    setFile(undefined);
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit New Exercise Request</DialogTitle>
          <DialogDescription>
            Provide details for the exercise you need solved and offer a price.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Calculus Integration Problem"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Select value={subject} onValueChange={setSubject} required>
                 <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a subject" />
                 </SelectTrigger>
                 <SelectContent>
                    {subjects.map((s) => (
                       <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                 </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the exercise or attach a file..."
                className="col-span-3"
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (€)
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} 
                className="col-span-3"
                min="0.01"
                step="0.01"
                placeholder="e.g., 10.00"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file-upload" className="text-right">
                File <span className="text-destructive">*</span>
              </Label>
              <div className="col-span-3">
                <Input 
                  id="file-upload" 
                  type="file" 
                  onChange={handleFileChange} 
                  className="text-sm" 
                  required
                />
                {file && <p className="text-xs text-muted-foreground mt-1">Selected: {file.name}</p>}
                {!file && error && <p className="text-xs text-destructive mt-1">A file is required.</p>}
              </div>
            </div>
            {error && <p className="text-sm text-destructive col-span-4 text-center">{error}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={onClose} className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={!title || !subject || !price || !file} className="cursor-pointer">
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 