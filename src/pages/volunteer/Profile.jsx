import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";


export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [volunteerData, setVolunteerData] = useState(null);
  
  const [isEditUsernameOpen, setIsEditUsernameOpen] = useState(false);
  const [isEditPasswordOpen, setIsEditPasswordOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      try {
        // Load volunteer data from localStorage
        const volunteers = JSON.parse(localStorage.getItem("volunteers") || "[]");
        const volunteer = volunteers.find((v) => v.id === user.id);
        
        if (volunteer) {
          setVolunteerData(volunteer);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      }
    }
  }, [user, toast]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditUsername = () => {
    if (!user || !newUsername.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid username",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update username in localStorage
      const volunteers = JSON.parse(localStorage.getItem("volunteers") || "[]");
      const updatedVolunteers = volunteers.map((v) => 
        v.id === user.id ? { ...v, fullName: newUsername } : v
      );
      
      localStorage.setItem("volunteers", JSON.stringify(updatedVolunteers));
      
      // Update user in context
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      currentUser.fullName = newUsername;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      
      // Update local state
      if (volunteerData) {
        setVolunteerData({ ...volunteerData, fullName: newUsername });
      }
      
      toast({
        title: "Success",
        description: "Username updated successfully",
      });
      
      setIsEditUsernameOpen(false);
      setNewUsername("");
      
      // Reload page to update context
      window.location.reload();
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update username",
        variant: "destructive",
      });
    }
  };

  const handleEditPassword = () => {
    if (!user || !currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check current password
      const volunteers = JSON.parse(localStorage.getItem("volunteers") || "[]");
      const volunteer = volunteers.find((v) => v.id === user.id);
      
      if (!volunteer || volunteer.password !== currentPassword) {
        toast({
          title: "Error",
          description: "Current password is incorrect",
          variant: "destructive",
        });
        return;
      }
      
      // Update password in localStorage
      const updatedVolunteers = volunteers.map((v) => 
        v.id === user.id ? { ...v, password: newPassword } : v
      );
      
      localStorage.setItem("volunteers", JSON.stringify(updatedVolunteers));
      
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      
      setIsEditPasswordOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Volunteer Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and activity stats</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {volunteerData?.fullName || user?.fullName || "Loading..."}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.email || "Loading..."}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Member since</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.memberSince ? formatDate(user.memberSince) : "Loading..."}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Donations completed</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {volunteerData?.donationsCompleted || 0}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Total credits</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {volunteerData?.totalCredits || 0}
                </dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditUsernameOpen(true)}
              className="mr-2"
            >
              Edit Username
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditPasswordOpen(true)}
            >
              Edit Password
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Username Dialog */}
      <Dialog open={isEditUsernameOpen} onOpenChange={setIsEditUsernameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Username</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="new-username" className="block text-sm font-medium text-gray-700">
                New Username
              </label>
              <Input
                id="new-username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditUsernameOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-primary hover:bg-green-600"
              onClick={handleEditUsername}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Password Dialog */}
      <Dialog open={isEditPasswordOpen} onOpenChange={setIsEditPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Password</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditPasswordOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-primary hover:bg-green-600"
              onClick={handleEditPassword}
            >
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
