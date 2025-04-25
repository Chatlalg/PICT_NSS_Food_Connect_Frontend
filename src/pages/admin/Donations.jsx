import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedDonations = JSON.parse(localStorage.getItem("donations") || "[]");
      setDonations(storedDonations);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load donations data",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleOpenDonationDetail = (id) => {
    setLocation(`/admin/donations/${id}`);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Donations</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {donations.length > 0 ? (
              donations.map((donation) => (
                <div
                  key={donation.id}
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary cursor-pointer"
                  onClick={() => handleOpenDonationDetail(donation.id)}
                >
                  <div className="flex-shrink-0">
                    <div className="h-20 w-20 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                      {donation.photoUrl ? (
                        <img
                          src={donation.photoUrl}
                          alt="Food donation"
                          className="h-full w-full object-cover"
                        />
                      ) : (
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
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Volunteer: {donation.volunteerName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      Mess: {donation.messName}
                    </p>
                    <span
                      className={`inline-flex mt-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        donation.status === "pending"
                          ? "bg-pink-100 text-pink-800"
                          : donation.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 sm:col-span-2 text-center py-10">
                <p className="text-gray-500">No donations submitted yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
