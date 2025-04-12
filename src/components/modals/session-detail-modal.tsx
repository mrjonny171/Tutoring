"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Clock, User, Users, MapPin, Monitor, Circle } from "lucide-react";

// Re-use the Session interface (consider defining centrally later)
interface Session {
  id: string;
  title: string;
  start: Date;
  end: Date;
  // Add fields relevant to both student/tutor views
  student?: { id: string; name: string; avatar: string; }; // Optional for student view
  tutor?: { id: string; name: string; avatar: string; }; // Optional for tutor view
  status: "scheduled" | "completed" | "cancelled";
  type: string; // Keep generic for now (online/in-person/group/one-on-one)
  // Add other relevant details like subject, notes, etc. later
}

interface SessionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}

export function SessionDetailModal({ isOpen, onClose, session }: SessionDetailModalProps) {
  if (!session) return null;

  const participant = session.tutor || session.student; // Get the other participant

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{session.title}</DialogTitle>
          <DialogDescription className="flex items-center pt-1">
            <Badge variant={session.status === 'completed' ? 'secondary' : 'default'} className="capitalize mr-2">
              {session.status}
            </Badge>
            {/* Display participant name */}
            {participant && (
              <span className="text-sm text-muted-foreground flex items-center">
                <User className="h-3 w-3 mr-1" /> With {participant.name}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{format(session.start, 'PPPP')}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{format(session.start, 'p')} - {format(session.end, 'p')}</span>
          </div>
          <div className="flex items-center gap-3">
             <Circle className="h-4 w-4 text-muted-foreground" fill={session.type.includes('online') ? 'currentColor' : 'none'} />
             <span className="text-sm capitalize">{session.type} Session</span>
          </div>
          {/* Add more details here as needed: Subject, Notes, Link to join, etc. */}
          {/* Example: 
          <div className="flex items-start gap-3">
             <BookOpen className="h-4 w-4 text-muted-foreground mt-1" /> 
             <p className="text-sm">Subject: Calculus</p> 
          </div> 
          <div className="flex items-start gap-3">
             <FileText className="h-4 w-4 text-muted-foreground mt-1" /> 
             <p className="text-sm">Notes: Focused on derivatives.</p> 
          </div> 
          */} 
        </div>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="cursor-pointer">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 