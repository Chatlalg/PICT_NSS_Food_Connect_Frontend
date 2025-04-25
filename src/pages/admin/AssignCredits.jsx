import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AssignCredits({ donation, onAssign, onCancel }) {
  const [credits, setCredits] = useState(3); // Default value
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign(credits);
  };

  const handleCancel = () => {
    setIsOpen(false);
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Credits</DialogTitle>
          <DialogDescription>
            Assign credits to volunteer {donation.volunteerName} for this donation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 mt-4">
            <label htmlFor="credits" className="block text-sm font-medium text-gray-700">
              Credits
            </label>
            <Input
              type="number"
              id="credits"
              value={credits}
              onChange={(e) => setCredits(parseInt(e.target.value) || 0)}
              min="1"
              max="10"
              className="mt-1"
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-green-600">
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
