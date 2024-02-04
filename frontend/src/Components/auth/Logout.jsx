import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUserInfo, signOutAsync } from "../../redux/user/userSlice";

const Logout = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);

  useEffect(() => {
    dispatch(signOutAsync());
  }, [dispatch]);

  return <>{!user && <Navigate to="/" replace={true} />}</>;
};

export default Logout;
