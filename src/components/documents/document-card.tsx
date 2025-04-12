"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DocumentCardProps {
  document: {
    id: string;
    title: string;
    type: string;
    subject: string;
    uploadedAt: Date;
    size: string;
    description: string;
  };
  onDownload: (documentId: string) => void;
}

function getFileTypeColor(type: string) {
  switch (type.toLowerCase()) {
    case "pdf":
      return "bg-red-500";
    case "docx":
      return "bg-blue-500";
    case "xlsx":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function DocumentCard({ document, onDownload }: DocumentCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <CardTitle className="flex flex-wrap items-center gap-2">
              {document.title}
              <Badge variant="secondary">{document.subject}</Badge>
            </CardTitle>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge className={getFileTypeColor(document.type)}>
                {document.type}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {document.size}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(document.id)}
            className="w-full sm:w-auto"
          >
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground break-words">
            {document.description}
          </p>
          <p className="text-sm text-muted-foreground">
            Uploaded: {formatDate(document.uploadedAt)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 