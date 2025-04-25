import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, Users } from "lucide-react";

export default function AdminLayout({ children }) {
  const [location, setLocation] = useLocation();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setLocation("/login");
      return;
    }
  }, [user, setLocation]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      setError(err.message || "Failed to logout");
      console.error("Logout error:", err);
    }
  };

  const isActive = (path) => {
    return location === path || location.startsWith(path + "/");
  };



  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary">
              <h1 className="text-lg font-semibold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                <Link
                  href="/admin/volunteers"
                  className={`${
                    isActive("/admin/volunteers")
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <Users className="text-gray-500 mr-3 flex-shrink-0 h-6 w-6" />
                  Volunteers
                </Link>
                <Link
                  href="/admin/donations"
                  className={`${
                    isActive("/admin/donations")
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <svg 
                    className="text-gray-500 mr-3 flex-shrink-0 h-6 w-6" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Donations
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left"
                >
                  <svg 
                    className="text-gray-500 mr-3 flex-shrink-0 h-6 w-6" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-2 mt-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px] bg-white">
            <SheetTitle className="text-lg font-semibold pt-3 text-center">Admin Dashboard</SheetTitle>
            <SheetDescription className="sr-only">
              Navigation menu for the admin dashboard
            </SheetDescription>
            <nav className="flex flex-col gap-2 ">
              <Link 
                href="/admin/volunteers"
                className={`px-3 py-2 rounded-md ${
                  isActive("/admin/volunteers")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="inline-block mr-2 h-5 w-5" />
                Volunteers
              </Link>
              <Link 
                href="/admin/donations"
                className={`px-3 py-2 rounded-md ${
                  isActive("/admin/donations")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg 
                  className="inline-block mr-2 h-5 w-5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Donations
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 w-full text-left"
              >
                <svg 
                  className="inline-block mr-2 h-5 w-5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}