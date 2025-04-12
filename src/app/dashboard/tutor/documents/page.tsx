"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Tag, Clock, FileText, Trash2, FilePenLine } from "lucide-react";
import { UploadDocumentModal } from "@/components/modals/upload-document-modal";
import { EditDocumentModal } from "@/components/modals/edit-document-modal";
import { ConfirmationModal } from "@/components/modals/confirmation-modal";

interface TutorDocument {
  id: string;
  title: string;
  subject: string;
  description?: string;
  price: number;
  fileName: string;
  uploadDate: string;
}

const mockTutorDocuments: TutorDocument[] = [
  {
    id: "doc1",
    title: "Calculus Cheat Sheet",
    subject: "Mathematics",
    description: "Quick reference guide for common calculus formulas and theorems.",
    price: 5.00,
    fileName: "calculus_cheat_sheet_v1.pdf",
    uploadDate: "2024-03-15",
  },
  {
    id: "doc2",
    title: "Physics Kinematics Explained",
    subject: "Physics",
    description: "In-depth explanation of kinematics concepts with examples.",
    price: 7.50,
    fileName: "physics_kinematics_notes.docx",
    uploadDate: "2024-03-18",
  },
  {
    id: "doc3",
    title: "Organic Chemistry Reaction Mechanisms",
    subject: "Chemistry",
    description: "Summary of key reaction mechanisms for Orgo 1.",
    price: 10.00,
    fileName: "orgo1_mechanisms.pdf",
    uploadDate: "2024-03-20",
  },
];

export default function TutorDocumentsPage() {
  const [documents, setDocuments] = useState<TutorDocument[]>(mockTutorDocuments);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDocumentForEdit, setSelectedDocumentForEdit] = useState<TutorDocument | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [documentToDeleteId, setDocumentToDeleteId] = useState<string | null>(null);

  const handleUploadDocumentClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleDocumentSubmit = (title: string, description: string, subject: string, price: number, file: File) => {
    const newDocument: TutorDocument = {
      id: crypto.randomUUID(),
      title,
      description,
      subject,
      price,
      fileName: file.name,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setDocuments(prevDocs => [newDocument, ...prevDocs]);
    console.log("New Document Submitted:", newDocument);
  };

  const handleDeleteClick = (docId: string) => {
    console.log("Requesting delete confirmation for:", docId);
    setDocumentToDeleteId(docId);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (documentToDeleteId) {
       console.log("Confirmed delete document:", documentToDeleteId);
       setDocuments(prev => prev.filter(doc => doc.id !== documentToDeleteId));
       setIsConfirmModalOpen(false);
       setDocumentToDeleteId(null);
    }
  };

  const handleEditClick = (doc: TutorDocument) => {
    console.log("Opening edit modal for document:", doc.id);
    setSelectedDocumentForEdit(doc);
    setIsEditModalOpen(true);
  };

  const handleDocumentUpdate = (updatedData: Omit<TutorDocument, 'fileName' | 'uploadDate'>) => {
    console.log("Updating document:", updatedData.id);
    setDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.id === updatedData.id 
          ? { ...doc, ...updatedData }
          : doc
      )
    );
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Documents</h1>
          <p className="text-muted-foreground">
            Manage documents you've uploaded for students to purchase.
          </p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table style={{tableLayout: 'fixed'}}>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="w-[100px] text-right">Price</TableHead>
              <TableHead className="w-[120px]">Uploaded</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length > 0 ? (
              documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium truncate" title={doc.title}>{doc.title}</TableCell>
                  <TableCell className="truncate" title={doc.subject}>{doc.subject}</TableCell>
                  <TableCell className="text-right">€{doc.price.toFixed(2)}</TableCell>
                  <TableCell>{doc.uploadDate}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(doc)} title="Edit Document">
                      <FilePenLine className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(doc.id)} title="Delete Document">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  You haven't uploaded any documents yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleDocumentSubmit}
      />

      <EditDocumentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        documentData={selectedDocumentForEdit}
        onSubmit={handleDocumentUpdate}
      />

      <ConfirmationModal
         isOpen={isConfirmModalOpen}
         onClose={() => setIsConfirmModalOpen(false)}
         onConfirm={confirmDelete}
         title="Confirm Deletion"
         description="Are you sure you want to delete this document? This action cannot be undone."
      />
    </div>
  );
} 