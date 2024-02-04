import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUserInfo } from "../../redux/user/userSlice";

const ProtectedAdmin = ({ children }) => {
  const user = useSelector(selectUserInfo);

  if (user && user.role !== "admin") {
    return <Navigate to="/login" replace={true} />;
  }
  return children;
};

export default ProtectedAdmin;
