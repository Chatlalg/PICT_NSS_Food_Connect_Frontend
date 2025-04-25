import { useState, useEffect } from "react";
import { useLocation, useRoute, useLocation as useWouterLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import AssignCredits from "./AssignCredits";

export default function DonationDetail() {
  const [, params] = useRoute("/admin/donations/:id");
  const [, setLocation] = useWouterLocation();
  const donationId = params?.id;

  const [donation, setDonation] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [showAssignCredits, setShowAssignCredits] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (donationId) {
      try {
        const storedDonations = JSON.parse(localStorage.getItem("donations") || "[]");
        const foundDonation = storedDonations.find((d) => d.id === donationId);

        if (foundDonation) {
          setDonation(foundDonation);
        } else {
          toast({
            title: "Error",
            description: "Donation not found",
            variant: "destructive",
          });
          setLocation("/admin/donations");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load donation data",
          variant: "destructive",
        });
        setLocation("/admin/donations");
      }
    }
  }, [donationId, toast, setLocation]);

  const handleClose = () => {
    setIsOpen(false);
    setLocation("/admin/donations");
  };

  const handleApprove = () => {
    setShowAssignCredits(true);
  };

  const handleReject = () => {
    if (!donation) return;

    try {
      const storedDonations = JSON.parse(localStorage.getItem("donations") || "[]");
      const updatedDonations = storedDonations.map((d) =>
        d.id === donation.id ? { ...d, status: "rejected" } : d
      );

      localStorage.setItem("donations", JSON.stringify(updatedDonations));

      toast({
        title: "Donation rejected",
        description: "The donation has been rejected successfully",
      });

      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject donation",
        variant: "destructive",
      });
    }
  };

  const handleAssignCredits = (credits) => {
    if (!donation) return;

    try {
      const storedDonations = JSON.parse(localStorage.getItem("donations") || "[]");
      const updatedDonations = storedDonations.map((d) =>
        d.id === donation.id ? { ...d, status: "approved", credits } : d
      );

      localStorage.setItem("donations", JSON.stringify(updatedDonations));

      const storedVolunteers = JSON.parse(localStorage.getItem("volunteers") || "[]");
      const updatedVolunteers = storedVolunteers.map((v) =>
        v.id === donation.volunteerId
          ? {
              ...v,
              totalCredits: (v.totalCredits || 0) + credits,
              donationsCompleted: (v.donationsCompleted || 0) + 1,
            }
          : v
      );

      localStorage.setItem("volunteers", JSON.stringify(updatedVolunteers));

      toast({
        title: "Credits assigned",
        description: `${credits} credits have been assigned to ${donation.volunteerName}`,
      });

      setShowAssignCredits(false);
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign credits",
        variant: "destructive",
      });
    }
  };

  if (showAssignCredits && donation) {
    return (
      <AssignCredits
        donation={donation}
        onAssign={handleAssignCredits}
        onCancel={() => setShowAssignCredits(false)}
      />
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-md overflow-y-auto" side="right">
        <SheetHeader>
          <SheetTitle>Donation Details</SheetTitle>
        </SheetHeader>

        {donation ? (
          <div className="space-y-6 mt-6">
            <div>
              <div className="flex justify-between">
                <div className="text-sm font-medium text-gray-500">Volunteer Name</div>
                <div className="text-sm text-gray-900">{donation.volunteerName}</div>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <div className="text-sm font-medium text-gray-500">Mess Name</div>
                <div className="text-sm text-gray-900">{donation.messName}</div>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <div className="text-sm font-medium text-gray-500">Food Type</div>
                <div className="text-sm text-gray-900">
                  {donation.foodType === "veg" ? "Vegetarian" : "Non-Vegetarian"}
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <div className="text-sm font-medium text-gray-500">Date</div>
                <div className="text-sm text-gray-900">
                  {new Date(donation.date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <div className="text-sm font-medium text-gray-500">Category</div>
                <div className="text-sm text-gray-900">{donation.category}</div>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <div className="text-sm font-medium text-gray-500">To be Consumed before</div>
                <div className="text-sm text-gray-900">
                  {new Date(donation.useBefore).toLocaleDateString()}
                </div>
              </div>
            </div>
            {donation.additionalInfo && (
              <div>
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-gray-500">Additional Description</div>
                  <div className="text-sm text-gray-900">{donation.additionalInfo}</div>
                </div>
              </div>
            )}

            <div className="bg-yellow-200 rounded-md p-4">
              <p className="text-sm font-medium text-center mb-2">Photo Proof</p>
              {donation.photoUrl ? (
                <img
                  className="w-full h-48 object-cover rounded-md"
                  src={donation.photoUrl}
                  alt="Food donation proof"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md">
                  <svg
                    className="h-12 w-12 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {donation.status === "pending" && (
              <div className="flex space-x-3">
                <Button className="flex-1 bg-primary hover:bg-green-600" onClick={handleApprove}>
                  Approve
                </Button>
                <Button className="flex-1" variant="outline" onClick={handleReject}>
                  Reject
                </Button>
              </div>
            )}

            {donation.status !== "pending" && (
              <div
                className={`p-3 rounded-md ${
                  donation.status === "approved" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <p className="text-center text-sm font-medium">
                  {donation.status === "approved"
                    ? `Approved with ${donation.credits} credits`
                    : "Donation was rejected"}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[80vh]">
            <p>Loading donation details...</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
