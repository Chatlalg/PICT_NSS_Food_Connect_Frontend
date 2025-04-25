import { useAuth } from "../context/AuthContext";
import { useLocation } from "wouter";

export default function PrivateRoute({ children, requiredRole }) {
    const { user, isLoading } = useAuth();
    const [, setLocation] = useLocation();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        setLocation("/login");
        return null;
    }

    if (requiredRole && user.role !== requiredRole) {
        setLocation("/login");
        return null;
    }

    return <>{children}</>;
}