import "../../styles/ForgetPassword.scss";
import img from "../../assets/forgot-password.png";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { greeting, index } from "../utils/common.jsx";
import { useDispatch, useSelector } from "react-redux";
import { clearError, forgotPasswordAsync } from "../../redux/user/userSlice.js";
import { useEffect } from "react";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.user);
  const { register, setValue, handleSubmit } = useForm();

  useEffect(() => {
    if (success) {
      toast.success("Password reset link sent to your email");
      dispatch(clearError());
      setValue("email", "");
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  });

  const handlePasswordSubmit = (data) => {
    dispatch(forgotPasswordAsync(data));
  };

  return (
    <>
      <div id="ForgetPassword">
        <div className="main">
          <div className="imgSection">
            <img src={img} />
          </div>
          <div className="formSection">
            <p className="p1">Hello!</p>
            <p className="p2">{greeting[index]}.</p>
            <form
              className="form"
              onSubmit={handleSubmit((data) => handlePasswordSubmit(data))}
            >
              <p className="p3">Forgot Password</p>
              <div className="inputBox">
                <input
                  className="fill"
                  type="email"
                  {...register("email", { required: "email is required" })}
                  required="required"
                />
                <label>email</label>
              </div>

              <button type="submit">Send</button>
            </form>
            <Link to="/login" className="signup">
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
