"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentCard } from "@/components/documents/document-card";

// Mock data for testing
const mockDocuments = [
  {
    id: "1",
    title: "Math Fundamentals",
    type: "pdf",
    subject: "Mathematics",
    uploadedAt: new Date("2024-03-15T12:00:00Z"),
    size: "2.5 MB",
    description: "Basic mathematical concepts and formulas for algebra and calculus.",
  },
  {
    id: "2",
    title: "Physics Notes",
    type: "docx",
    subject: "Physics",
    uploadedAt: new Date("2024-03-14T12:00:00Z"),
    size: "1.8 MB",
    description: "Comprehensive notes on mechanics and thermodynamics.",
  },
  {
    id: "3",
    title: "Chemistry Lab Report",
    type: "pdf",
    subject: "Chemistry",
    uploadedAt: new Date("2024-03-13T12:00:00Z"),
    size: "3.2 MB",
    description: "Detailed report on chemical reactions and experimental procedures.",
  },
  {
    id: "4",
    title: "Biology Data Analysis",
    type: "xlsx",
    subject: "Biology",
    uploadedAt: new Date("2024-03-12T12:00:00Z"),
    size: "1.5 MB",
    description: "Statistical analysis of biological experiments and research data.",
  },
];

export function DocumentsContent() {
  const handleDownload = async (documentId: string) => {
    console.log("Downloading document:", documentId);
    // Implement actual download logic here
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    if (file) {
      console.log("Uploading document:", file);
      // Implement actual upload logic here
      e.currentTarget.reset();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
          <p className="text-muted-foreground">
            Access and manage your learning materials
          </p>
        </div>
        <form
          onSubmit={handleUpload}
          className="flex items-center gap-4"
        >
          <input
            type="file"
            name="file"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button type="submit">Upload</Button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockDocuments.map((document) => (
          <DocumentCard 
            key={document.id} 
            document={document} 
            onDownload={handleDownload}
          />
        ))}
      </div>
    </div>
  );
} 