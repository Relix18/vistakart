import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUserInfo } from "../../redux/user/userSlice";

const Protected = ({ children }) => {
  const user = useSelector(selectUserInfo);

  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }
  return children;
};

export default Protected;
