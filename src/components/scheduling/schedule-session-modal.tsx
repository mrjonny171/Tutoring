"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parse } from "date-fns";
import { Calendar, Clock, Users, Video, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface ScheduleSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: "STUDENT" | "TUTOR";
  availableUsers: User[];
  preSelectedUserId?: string;
}

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return [`${hour}:00`, `${hour}:30`];
}).flat();

type SessionType = "online" | "in-person";

export function ScheduleSessionModal({
  isOpen,
  onClose,
  role,
  availableUsers,
  preSelectedUserId,
}: ScheduleSessionModalProps) {
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState<string>("");
  const [duration, setDuration] = useState<string>("60");
  const [selectedUser, setSelectedUser] = useState<string>(preSelectedUserId || "");
  const [notes, setNotes] = useState<string>("");
  const [sessionType, setSessionType] = useState<SessionType>("online");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ date, time, duration, selectedUser, notes, sessionType });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Schedule New Session</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Session Type</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={sessionType === "online" ? "default" : "outline"}
                className="flex-1 gap-2"
                onClick={() => setSessionType("online")}
              >
                <Video className="h-4 w-4" />
                Online
              </Button>
              <Button
                type="button"
                variant={sessionType === "in-person" ? "default" : "outline"}
                className="flex-1 gap-2"
                onClick={() => setSessionType("in-person")}
              >
                <Users className="h-4 w-4" />
                In Person
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user">Select {role === "STUDENT" ? "Tutor" : "Student"}</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger id="user" className="w-full">
                  <SelectValue placeholder={`Choose a ${role === "STUDENT" ? "tutor" : "student"}`} />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span>{user.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Session Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration" className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date and Time</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="relative">
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={format(new Date(), "yyyy-MM-dd")}
                      className={cn(
                        "w-full pl-10 text-left",
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "placeholder:text-muted-foreground",
                        "[&::-webkit-calendar-picker-indicator]:hidden",
                        "[&::-webkit-inner-spin-button]:hidden",
                        "[&::-webkit-clear-button]:hidden",
                        "appearance-none"
                      )}
                    />
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select time" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {format(parse(slot, "HH:mm", new Date()), "h:mm a")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any specific topics or requirements for the session..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={!date || !time || !selectedUser || !duration}
            >
              Schedule Session
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 