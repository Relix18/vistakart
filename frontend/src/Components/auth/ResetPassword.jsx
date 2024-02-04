import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../styles/ResetPassword.scss";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { clearError, resetPasswordAsync } from "../../redux/user/userSlice";
import { toast } from "react-hot-toast";

const ResetPassword = () => {
  const [showPasswords, setShowPasswords] = useState({
    password1: false,
    password2: false,
  });
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, success } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (success) {
      toast.success("Password changed successfully");
      dispatch(clearError());
      navigate("/login");
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  });

  const handleTogglePassword = (field) => {
    setShowPasswords((prevShowPasswords) => ({
      ...prevShowPasswords,
      [field]: !prevShowPasswords[field],
    }));
  };

  const handlePasswordSubmit = (data) => {
    const resetDetails = {
      password: data.newPassword,
      confirmPassword: data.confirmPassword,
      token: params.token,
    };
    dispatch(resetPasswordAsync(resetDetails));
  };

  return (
    <>
      <div id="ResetPassword">
        <div className="main">
          <div className="formSection">
            <form
              className="form"
              onSubmit={handleSubmit((data) => handlePasswordSubmit(data))}
            >
              <p className="p3">Reset Password</p>
              <div className="inputBox">
                <input
                  className="fill"
                  type={showPasswords.password1 ? `text` : `password`}
                  {...register("newPassword", {
                    required: "Password is required",
                  })}
                  required="required"
                />
                <div onClick={() => handleTogglePassword("password1")}>
                  {showPasswords.password1 ? (
                    <IoEyeOffOutline />
                  ) : (
                    <IoEyeOutline />
                  )}
                </div>
                <label>new password</label>
              </div>
              <div className="inputBox">
                <input
                  className="fill"
                  type={showPasswords.password2 ? `text` : `password`}
                  {...register("confirmPassword", {
                    required: "confirm password is required",
                    validate: (value, formValues) =>
                      value === formValues.newPassword ||
                      "password not matching",
                  })}
                  required="required"
                />
                <div onClick={() => handleTogglePassword("password2")}>
                  {showPasswords.password2 ? (
                    <IoEyeOffOutline />
                  ) : (
                    <IoEyeOutline />
                  )}
                </div>
                <label>confirm password</label>
                {errors.confirmPassword && (
                  <p>{errors.confirmPassword.message}</p>
                )}
              </div>

              <button type="submit">Reset</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
