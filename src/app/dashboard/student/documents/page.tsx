"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper";
import type { DocumentType } from "@/components/modals/upload-document-modal";

interface Document {
  id: string;
  title: string;
  type: DocumentType;
  uploadDate: string;
}

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Calculus Study Guide",
    type: "STUDY_MATERIAL",
    uploadDate: "2024-03-15",
  },
  {
    id: "2",
    title: "Physics Formula Sheet",
    type: "STUDY_MATERIAL",
    uploadDate: "2024-03-16",
  },
  {
    id: "3",
    title: "Week 1 - Introduction to Calculus",
    type: "LECTURE_NOTE",
    uploadDate: "2024-03-14",
  },
  {
    id: "4",
    title: "Week 2 - Derivatives",
    type: "LECTURE_NOTE",
    uploadDate: "2024-03-17",
  },
];

export default function StudentDocumentsPage() {
  const studyMaterials = mockDocuments.filter(doc => doc.type === "STUDY_MATERIAL");
  const lectureNotes = mockDocuments.filter(doc => doc.type === "LECTURE_NOTE");

  return (
    <DashboardWrapper>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Access your study materials and lecture notes
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Study Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studyMaterials.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Uploaded on {doc.uploadDate}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lecture Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lectureNotes.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Uploaded on {doc.uploadDate}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardWrapper>
  );
} 