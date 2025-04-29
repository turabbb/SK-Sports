import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.UserAuth);

  if (!user) {
    // If not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the child component
  return children;
};

export default PrivateRoute;
