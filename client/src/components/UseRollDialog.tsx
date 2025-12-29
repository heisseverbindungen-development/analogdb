import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Camera } from "lucide-react";

interface UseRollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (camera: string, notes: string) => void;
  filmName: string;
}

export default function UseRollDialog({ open, onOpenChange, onConfirm, filmName }: UseRollDialogProps) {
  const [camera, setCamera] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(camera, notes);
    setCamera("");
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Load Film
          </DialogTitle>
          <DialogDescription>
            You are loading <strong>{filmName}</strong>. Add details about your setup.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="camera">Camera</Label>
            <Input
              id="camera"
              placeholder="e.g. Canon AE-1"
              value={camera}
              onChange={(e) => setCamera(e.target.value)}
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Location, project idea, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Load to Camera</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
