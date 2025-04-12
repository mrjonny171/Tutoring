"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

export interface UserInfo {
  id: string;
  name: string;
  avatar?: string; // Optional avatar
  role: "STUDENT" | "TUTOR";
}

interface LeaveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: UserInfo | null;
  onSubmit: (rating: number, reviewText: string) => void; // Callback for submission
}

export function LeaveReviewModal({ isOpen, onClose, targetUser, onSubmit }: LeaveReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleStarClick = (index: number) => {
    setRating(index);
  };

  const handleReviewSubmit = () => {
    if (rating > 0 && targetUser) {
      console.log(`Submitting review for ${targetUser.name}: Rating ${rating}, Review: ${reviewText}`);
      onSubmit(rating, reviewText); // Call the passed onSubmit function
      handleClose(); // Close modal after submit
    } else {
      // Optional: Add user feedback if rating is missing
      console.warn("Rating is required to submit a review.");
    }
  };

  const handleClose = () => {
    setRating(0); // Reset state on close
    setReviewText("");
    setHoverRating(0);
    onClose();
  };

  if (!targetUser) return null;

  const targetRoleLabel = targetUser.role === "STUDENT" ? "student" : "tutor";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave a Review for {targetUser.name}</DialogTitle>
          <DialogDescription>
            Share your experience with this {targetRoleLabel}. Your feedback helps others.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((index) => (
                <Star
                  key={index}
                  className={`h-6 w-6 cursor-pointer transition-colors ${
                    (hoverRating || rating) >= index ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                  }`}
                  onClick={() => handleStarClick(index)}
                  onMouseEnter={() => setHoverRating(index)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
            {rating === 0 && <p className="text-xs text-destructive">Please select a rating.</p>}
          </div>

          {/* Review Text -> Description */}
          <div className="space-y-2">
            <Label htmlFor="review-description">Description (Optional)</Label>
            <Textarea
              id="review-description"
              placeholder={`Describe your experience with ${targetUser.name}...`}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose} className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleReviewSubmit} disabled={rating === 0} className="cursor-pointer">
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 