import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Activities() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (user) {
      try {
        // Load donations from localStorage
        const allDonations = JSON.parse(localStorage.getItem("donations") || "[]");
        
        // Filter donations by volunteer ID
        const volunteerDonations = allDonations.filter(
          (donation) => donation.volunteerId === user.id
        );
        
        // Sort by date, newest first
        const sortedDonations = volunteerDonations.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setActivities(sortedDonations);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load activities",
          variant: "destructive",
        });
      }
    }
  }, [user, toast]);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Activities</h1>
        <div className="mt-6">
          <ul className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <li
                  key={activity.id}
                  className={`overflow-hidden shadow rounded-lg ${
                    activity.status === "pending"
                      ? "bg-pink-100"
                      : "bg-mint" // Green for approved
                  }`}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-md overflow-hidden">
                        {activity.photoUrl ? (
                          <img
                            src={activity.photoUrl}
                            alt="Food donation"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <svg
                            className="h-full w-full text-gray-400"
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
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Mess name: {activity.messName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800">
                        {activity.status === "approved" && activity.credits
                          ? `${activity.credits} Token${activity.credits > 1 ? "s" : ""}`
                          : "1 Token"}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No activities found</p>
                <p className="text-sm text-gray-400 mt-2">
                  Submit your first food donation to get started
                </p>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
