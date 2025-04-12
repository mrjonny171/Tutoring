import { User } from "@prisma/client";

export type TutorSessionWithUsers = {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  studentId: string;
  tutorId: string;
  student: User;
  tutor: User;
  createdAt: Date;
  updatedAt: Date;
}; 