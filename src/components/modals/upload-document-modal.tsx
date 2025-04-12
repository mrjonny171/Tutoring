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
import { Upload } from "lucide-react";

// Mock subjects (replace/fetch actual data)
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Literature", "Computer Science", "Other"];

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, subject: string, price: number, file: File) => void;
}

export function UploadDocumentModal({ isOpen, onClose, onSubmit }: UploadDocumentModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(""); // Clear error when file is selected
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Validation
    if (!title || !subject || price <= 0 || !file) {
      setError("Please fill in title, subject, price (> 0), and select a file.");
      return;
    }
    onSubmit(title, description, subject, price, file);
    handleClose();
  };

  const handleClose = () => {
    // Reset form state
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
          <DialogTitle>Upload New Document</DialogTitle>
          <DialogDescription>
            Provide details and the price for the document you want to sell.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doc-title" className="text-right">Title <span className="text-destructive">*</span></Label>
              <Input id="doc-title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" required />
            </div>
            {/* Subject Dropdown */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doc-subject" className="text-right">Subject <span className="text-destructive">*</span></Label>
              <Select value={subject} onValueChange={setSubject} required>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a subject" /></SelectTrigger>
                <SelectContent>{subjects.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            {/* Description */} 
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doc-description" className="text-right">Description</Label>
              <Textarea id="doc-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="(Optional) Briefly describe the document..." className="col-span-3" rows={3}/>
            </div>
            {/* Price Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doc-price" className="text-right">Price (€) <span className="text-destructive">*</span></Label>
              <Input id="doc-price" type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} className="col-span-3" min="0.01" step="0.01" required placeholder="e.g., 5.00"/>
            </div>
            {/* File Upload */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doc-file" className="text-right">File <span className="text-destructive">*</span></Label>
              <div className="col-span-3">
                <Input id="doc-file" type="file" onChange={handleFileChange} className="text-sm" required accept=".pdf,.doc,.docx,.zip,.png,.jpg"/>
                {file && <p className="text-xs text-muted-foreground mt-1">Selected: {file.name}</p>}
                {!file && error && <p className="text-xs text-destructive mt-1">A file is required.</p>} 
              </div>
            </div>
            {error && <p className="text-sm text-destructive col-span-4 text-center">{error}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="submit"><Upload className="mr-2 h-4 w-4 cursor-pointer" /> Upload Document</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 