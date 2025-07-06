import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Navigate } from "react-router";

const PublicRoute = ({ children }: { children: ReactNode }) => {
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

  if (user) {
    return <Navigate to={"/"} replace />;
  }
  return children;
};

export default PublicRoute;
