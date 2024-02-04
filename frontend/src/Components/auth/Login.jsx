import "../../styles/Login.scss";
import img from "../../assets/woman.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { greeting, index } from "../utils/common.jsx";
import {
  selectUserInfo,
  logInUserAsync,
  clearError,
} from "../../redux/user/userSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const Login = () => {
  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.user);
  const user = useSelector(selectUserInfo);
  const [pass, setPass] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (success) {
      toast.success(`LogIn Successfully`);
      dispatch(clearError());
      navigate("/");
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  });

  return (
    <>
      {user && <Navigate to="/" replace={true} />}
      <div id="Login">
        <div className="main">
          <div className="imgSection">
            <img src={img} />
          </div>
          <div className="formSection">
            <p className="p1">Hello!</p>
            <p className="p2">{greeting[index]}.</p>
            <form
              className="form"
              onSubmit={handleSubmit((data) => {
                dispatch(
                  logInUserAsync({
                    email: data.email,
                    password: data.password,
                  })
                );
              })}
            >
              <p className="p3">Login to your account</p>
              <div className="inputBox">
                <input
                  className="fill"
                  {...register("email", {
                    required: "email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "invalid email address",
                    },
                  })}
                  required
                  type="email"
                />
                <label>email</label>
                {errors.email && (
                  <p className="error email-err"> {errors.email.message}</p>
                )}
              </div>
              <div className="inputBox">
                <input
                  className="fill"
                  {...register("password", {
                    required: "password is required",
                  })}
                  required
                  type={pass ? `text` : `password`}
                />
                <div onClick={() => setPass(!pass)}>
                  {pass ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </div>
                {errors.password && (
                  <p className="error "> {errors.password.message}</p>
                )}
                <label> password</label>
              </div>
              <div className="resetDiv">
                <Link className="resetPass" to="/forget-password">
                  Forget Password?
                </Link>
              </div>
              <button type="submit">Login</button>
            </form>
            <Link to="/signup" className="signup">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
