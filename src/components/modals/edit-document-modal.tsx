"use client";

import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";

// Re-use or import the TutorDocument interface
interface TutorDocument {
  id: string;
  title: string;
  subject: string;
  description?: string;
  price: number;
  fileName: string;
  uploadDate: string;
}

// Mock subjects (should ideally be shared/fetched)
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Literature", "Computer Science", "Other"];

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: TutorDocument | null; // Document to edit
  // onSubmit passes back the updated document data (excluding file)
  onSubmit: (updatedData: Omit<TutorDocument, 'fileName' | 'uploadDate'>) => void;
}

export function EditDocumentModal({ isOpen, onClose, documentData, onSubmit }: EditDocumentModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [error, setError] = useState<string>("");

  // Pre-fill form when documentData changes (modal opens)
  useEffect(() => {
    if (documentData) {
      setTitle(documentData.title);
      setDescription(documentData.description || "");
      setSubject(documentData.subject);
      setPrice(documentData.price);
      setError(""); // Clear errors when opening
    }
  }, [documentData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Validation
    if (!title || !subject || price <= 0 || !documentData) { // Check documentData exists
      setError("Title, subject, and price (> 0) are required.");
      return;
    }
    // Submit updated data (excluding file-related fields)
    onSubmit({
      id: documentData.id, // Pass back the ID
      title,
      description,
      subject,
      price,
    });
    onClose(); // Close modal on successful submit
  };

  // Don't render the modal if no data is provided
  if (!documentData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Document Details</DialogTitle>
          <DialogDescription>
            Update the information for your document. File content cannot be changed here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-doc-title" className="text-right">Title <span className="text-destructive">*</span></Label>
              <Input id="edit-doc-title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" required />
            </div>
            {/* Subject Dropdown */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-doc-subject" className="text-right">Subject <span className="text-destructive">*</span></Label>
              <Select value={subject} onValueChange={setSubject} required>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a subject" /></SelectTrigger>
                <SelectContent>{subjects.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            {/* Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-doc-description" className="text-right">Description</Label>
              <Textarea id="edit-doc-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="(Optional) Briefly describe the document..." className="col-span-3" rows={3}/>
            </div>
            {/* Price Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-doc-price" className="text-right">Price (€) <span className="text-destructive">*</span></Label>
              <Input id="edit-doc-price" type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} className="col-span-3" min="0.01" step="0.01" required placeholder="e.g., 5.00"/>
            </div>
             {/* Display Original Filename (Readonly) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-doc-filename" className="text-right">Filename</Label>
              <Input id="edit-doc-filename" value={documentData.fileName} className="col-span-3 text-muted-foreground" readOnly disabled/>
            </div>
            {error && <p className="text-sm text-destructive col-span-4 text-center">{error}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 