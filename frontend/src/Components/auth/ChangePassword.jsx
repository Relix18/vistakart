import React, { useEffect, useState } from "react";
import "../../styles/ChangePassword.scss";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { changePasswordAsync, clearError } from "../../redux/user/userSlice";
import { toast } from "react-hot-toast";

const ChangePassword = () => {
  const [showPasswords, setShowPasswords] = useState({
    password1: false,
    password2: false,
    password3: false,
  });
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
      navigate("/profile");
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error]);

  const handleTogglePassword = (field) => {
    setShowPasswords((prevShowPasswords) => ({
      ...prevShowPasswords,
      [field]: !prevShowPasswords[field],
    }));
  };

  const changePasswordHandler = (data) => {
    dispatch(changePasswordAsync(data));
  };

  return (
    <>
      <div id="ChangePassword">
        <div className="main">
          <form
            className="form"
            onSubmit={handleSubmit((data) => changePasswordHandler(data))}
          >
            <p className="p3">Change Password</p>
            <div className="inputBox">
              <input
                className="fill"
                type={showPasswords.password1 ? `text` : `password`}
                {...register("oldPassword", {
                  required: "Old Password is required",
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
              <label>Old Password</label>
            </div>
            <div className="inputBox">
              <input
                className="fill"
                type={showPasswords.password2 ? `text` : `password`}
                {...register("newPassword", {
                  required: "password is required",
                  pattern: {
                    value:
                      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                    message: `at least 8 characters, must contain uppercase letter, lowercase letter, number and special characters`,
                  },
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
              <label>New Password</label>
              {errors.newPassword && <p>{errors.newPassword.message}</p>}
            </div>
            <div className="inputBox">
              <input
                className="fill"
                type={showPasswords.password3 ? `text` : `password`}
                {...register("confirmPassword", {
                  required: "confirm password is required",
                  validate: (value, formValues) =>
                    value === formValues.newPassword || "password not matching",
                })}
                required="required"
              />
              <div onClick={() => handleTogglePassword("password3")}>
                {showPasswords.password3 ? (
                  <IoEyeOffOutline />
                ) : (
                  <IoEyeOutline />
                )}
              </div>
              <label>Confirm Password</label>
              {errors.confirmPassword && (
                <p>{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="btn">
              <Link to="/profile">
                <button>Cancel</button>
              </Link>
              <button type="submit">Change</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
