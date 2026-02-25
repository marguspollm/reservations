import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router";
import Loading from "../components/Loading";

function RequireAuth() {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  if (isLoading) return <Loading open={isLoading} />;

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RequireAuth;
