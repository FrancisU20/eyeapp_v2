import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();

  if (auth.roles === allowedRoles) {
    return <Outlet />;
  } else if (auth.roles !== allowedRoles) {
    return <Navigate to={`/unauthorized`} />;
  } else {
    return <Navigate to={`/login`} />;
  }
};

export default RequireAuth;
