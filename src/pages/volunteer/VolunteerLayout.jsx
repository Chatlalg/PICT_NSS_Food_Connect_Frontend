import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Upload, Calendar, User, LogOut } from "lucide-react";

export default function VolunteerLayout({ children }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const getInitials = () => {
    if (!user?.fullName) return "?";
    return user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-lg font-bold text-primary">Food Connect</span>
              </div>
            </div>
            <div className="flex items-center">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <span className="sr-only">Open menu</span>
                    <div className="h-8 w-8 rounded-full bg-secondary-400 flex items-center justify-center text-white">
                      <span>{getInitials()}</span>
                    </div>
                  </button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="py-4">
                    <h2 className="text-lg font-semibold mb-6">Menu</h2>
                    <nav className="flex flex-col gap-3">
                      <div
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          window.location.href = "/volunteer/pickup";
                        }}
                      >
                        <div
                          className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer ${
                            location === "/volunteer/pickup"
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <Upload className="h-5 w-5" />
                          Pickup Details
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          window.location.href = "/volunteer/activities";
                        }}
                      >
                        <div
                          className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer ${
                            location === "/volunteer/activities"
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <Calendar className="h-5 w-5" />
                          Activities
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          window.location.href = "/volunteer/profile";
                        }}
                      >
                        <div
                          className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer ${
                            location === "/volunteer/profile"
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <User className="h-5 w-5" />
                          Profile
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 text-left"
                      >
                        <LogOut className="h-5 w-5" />
                        Logout
                      </button>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="pb-16 md:pb-0">{children}</div>

      {/* Bottom Navigation (Mobile only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around">
        <div
          onClick={() => (window.location.href = "/volunteer/pickup")}
          className={`flex flex-col items-center py-3 px-4 cursor-pointer ${
            location === "/volunteer/pickup"
              ? "text-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Upload className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Donate</span>
        </div>

        <div
          onClick={() => (window.location.href = "/volunteer/activities")}
          className={`flex flex-col items-center py-3 px-4 cursor-pointer ${
            location === "/volunteer/activities"
              ? "text-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Calendar className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Activities</span>
        </div>

        <div
          onClick={() => (window.location.href = "/volunteer/profile")}
          className={`flex flex-col items-center py-3 px-4 cursor-pointer ${
            location === "/volunteer/profile"
              ? "text-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <User className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Profile</span>
        </div>
      </div>
    </div>
  );
}
