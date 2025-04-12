"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileUp, Tag, User, Clock, Download, Filter, FileCheck } from "lucide-react";

interface Exercise {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  submissionsCount: number;
  hasSolution: boolean;
}

interface ExerciseRequest {
  id: string;
  title: string;
  subject: string;
  description?: string;
  price: number;
  status: "pending" | "solved";
  submittedDate: string;
  student: {
    id: string;
    name: string;
  };
  fileName: string;
  solutionFileName?: string;
  isPaid?: boolean;
}

type TutorExerciseStatusFilter = "pending" | "solved" | "all";

const mockExercises: Exercise[] = [
  {
    id: "1",
    title: "Calculus Problem Set",
    subject: "Mathematics",
    dueDate: "2024-03-20",
    submissionsCount: 5,
    hasSolution: true,
  },
  {
    id: "2",
    title: "Physics Practice Problems",
    subject: "Physics",
    dueDate: "2024-03-22",
    submissionsCount: 3,
    hasSolution: false,
  },
];

const mockExerciseRequests: ExerciseRequest[] = [
  {
    id: "exr1",
    title: "Calculus Problem Set Revision",
    subject: "Mathematics",
    description: "Review the attached problems and provide detailed solutions.",
    price: 15.00,
    status: "solved",
    submittedDate: "2024-03-18",
    student: { id: "s1", name: "Alice Johnson" },
    fileName: "calculus_problems_v2.pdf",
    solutionFileName: "calculus_solution_final.pdf",
    isPaid: true,
  },
  {
    id: "exr2",
    title: "Physics Practice Problems",
    subject: "Physics",
    description: "Need help solving problems 5-10 attached.",
    price: 20.50,
    status: "pending",
    submittedDate: "2024-03-20",
    student: { id: "s1", name: "Alice Johnson" },
    fileName: "physics_questions.pdf",
  },
  {
    id: "exr3",
    title: "Chemistry Lab Report Analysis",
    subject: "Chemistry",
    description: "Analyze the results of the attached lab report and answer the questions.",
    price: 10.00,
    status: "solved",
    submittedDate: "2024-03-21",
    student: { id: "s2", name: "Bob Williams" },
    fileName: "chem_lab_report.docx",
    solutionFileName: "chem_lab_solution.pdf",
    isPaid: false,
  },
  {
    id: "exr4",
    title: "Differential Equations Set",
    subject: "Mathematics",
    description: "Solve the following set of differential equations.",
    price: 25.00,
    status: "solved",
    submittedDate: "2024-03-22",
    student: { id: "s1", name: "Alice Johnson" },
    fileName: "diff_eq_set.pdf",
    solutionFileName: "diff_eq_solution.pdf",
    isPaid: false,
  },
  {
    id: "exr5",
    title: "Python Data Structure Task",
    subject: "Computer Science",
    description: "Implement a linked list with insert and delete methods.",
    price: 12.00,
    status: "solved",
    submittedDate: "2024-03-22",
    student: { id: "s2", name: "Bob Williams" },
    fileName: "python_ds_task.py",
    solutionFileName: "python_ds_solution.zip",
    isPaid: true,
  },
];

export default function TutorExercisesPage() {
  const [exerciseRequests, setExerciseRequests] = useState<ExerciseRequest[]>(mockExerciseRequests);
  const [filterStatus, setFilterStatus] = useState<TutorExerciseStatusFilter>('pending');

  const handleUploadSolutionClick = (request: ExerciseRequest) => {
    console.log("Attempting to upload solution for:", request.id);
  };

  const handleRequestDownloadClick = (fileName: string) => {
    console.log(`Attempting to download request file: ${fileName}`);
    alert(`Download simulation: ${fileName}`);
  };

  const handleSolutionDownloadClick = (solutionFileName: string | undefined) => {
    if (!solutionFileName) return;
    console.log(`Attempting to download solution file: ${solutionFileName}`);
    alert(`Download simulation: ${solutionFileName}`);
  };

  const filteredRequests = exerciseRequests.filter(request =>
    filterStatus === 'all' || request.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Available Exercise Requests</h1>
          <p className="text-muted-foreground">
            Browse pending requests and upload solutions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={filterStatus === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </Button>
          <Button
            variant={filterStatus === 'solved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('solved')}
          >
            Solved
          </Button>
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            All Requests
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <Card key={request.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{request.title}</CardTitle>
                <CardDescription>
                  <span className="font-medium">{request.subject}</span>
                  <span className="mx-1.5">•</span>
                  <span>From: {request.student.name}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-4 min-h-[60px]">
                {request.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{request.description}</p>
                )}
              </CardContent>
              <div className="border-t px-6 py-3 text-sm flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Submitted: {request.submittedDate}
                </span>
                <span className="flex items-center gap-1 font-semibold text-green-600 dark:text-green-500">
                  <Tag className="h-4 w-4"/> Payout: €{request.price.toFixed(2)}
                </span>
              </div>
              <CardFooter className="border-t px-6 py-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  {request.status === 'solved' ? (
                    request.isPaid ? (
                      <Badge variant="success">Paid</Badge>
                    ) : (
                      <Badge variant="secondary">Solved</Badge>
                    )
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRequestDownloadClick(request.fileName)}
                    title={`Download student request file (${request.fileName})`}
                  >
                    <Download className="h-4 w-4 mr-2" /> Request
                  </Button>
                  {request.status === 'solved' && request.solutionFileName && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSolutionDownloadClick(request.solutionFileName)}
                      title={`Download your solution (${request.solutionFileName})`}
                    >
                      <FileCheck className="h-4 w-4 mr-2" /> Solution
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8 md:col-span-2 lg:col-span-3">
            No exercise requests match the current filter.
          </p>
        )}
      </div>
    </div>
  );
} 