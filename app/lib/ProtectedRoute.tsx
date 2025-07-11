import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";
import { type ReactNode } from "react";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <img
          src="foodly_logo-removebg-preview.png"
          width={300}
          height={300}
          className="animate-pulse"
        />
        <Loader2 className="animate-spin mb-5" color="orange" size={50} />
        <p>Hold on! We are setting you up...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  if (user.role === "CUSTOMER") {
    return <Navigate to={"/signup"} replace />;
  }

  if (!user.isVerified) {
    return <Navigate to={"/verify-email?redirect=true"} replace />;
  }
  return children;
};

export default ProtectedRoute;
