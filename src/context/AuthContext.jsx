import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios";
import { useLocation } from "wouter";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [, setLocation] = useLocation();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                setIsLoading(true)
                // const response = await axios.get(`${process.env.SERVER_URL}/auth/me`, {
                //     withCredentials: true,
                // })
                // if (!response.data || !response.data.role) throw new Error("can't get user role")
                setUser({ role: "admin" }) // Temporary mock data
                setIsLoading(false)
            } catch (error) {
                console.log("Error fetching user role: ", error)
                setUser(null)
                setLocation("/login")
            } finally {
                setIsLoading(false)
            }
        }
        fetchUserRole()
    }, [setLocation])

    const logout = async () => {
        try {
            // await axios.post(`${process.env.SERVER_URL}/auth/logout`, {}, {
            //     withCredentials: true,
            // })
            setUser(null)
            setLocation("/login")
        } catch (error) {
            console.error("Logout error:", error)
            throw error
        }
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}