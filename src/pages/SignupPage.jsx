import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [academicYear, setAcademicYear] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await signup(fullName, email, password);
      
      if (success) {
        setLocation("/volunteer/pickup");
      } else {
        toast({
          title: "Signup failed",
          description: "This email is already registered. Please use a different email or login instead.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during signup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create volunteer account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join PICT NSS Food Connect
        </p>
      </div>

      <Card className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <CardContent className="pt-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                id="fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="signup-enrollment-number" className="block text-sm font-medium text-gray-700">
                Enrollment Number
              </label>
              <Input
                id="signup-enrollment-number"
                type="text"
                value={enrollmentNumber}
                onChange={(e) => setEnrollmentNumber(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="signup-academic-year" className="block text-sm font-medium text-gray-700">
                Current Academic Year
              </label>
              <Input
                id="signup-academic-year"
                type="number"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                min = "1"
                max = "3"
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-green-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-primary hover:text-green-500"
              >
                Login
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
