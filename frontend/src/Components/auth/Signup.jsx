import "../../styles/Signup.scss";
import img from "../../assets/shopping.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { greeting, index } from "../utils/common.jsx";
import {
  createUserAsync,
  selectUserInfo,
  clearError,
} from "../../redux/user/userSlice";
import { useEffect, useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import toast from "react-hot-toast";

const Signup = () => {
  const dispatch = useDispatch();
  const [showPasswords, setShowPasswords] = useState({
    password1: false,
    password2: false,
  });
  const user = useSelector(selectUserInfo);
  const { error, success } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState("/Profile.png");

  const handleTogglePassword = (field) => {
    setShowPasswords((prevShowPasswords) => ({
      ...prevShowPasswords,
      [field]: !prevShowPasswords[field],
    }));
  };

  useEffect(() => {
    if (success) {
      toast.success(`Welcome`);
      dispatch(clearError());
      navigate("/");
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  });

  const handleAvatar = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleUserSubmit = async (data) => {
    if (previewImage === "/Profile.png") {
      dispatch(
        createUserAsync({
          email: data.email,
          password: data.password,
          name: "New User",
        })
      );
    } else {
      dispatch(
        createUserAsync({
          email: data.email,
          password: data.password,
          avatar: previewImage,
          name: "New User",
        })
      );
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  return (
    <>
      {user && <Navigate to="/" replace={true} />}
      <div id="Signup">
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
                handleUserSubmit(data);
              })}
            >
              <p className="p3">Create account</p>
              <div className="inputBox">
                <input
                  className="fill"
                  type="text"
                  {...register("email", {
                    required: "email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "invalid email address",
                    },
                  })}
                  required
                />
                <label>email</label>
                {errors.email && (
                  <p className="error email-err"> {errors.email.message}</p>
                )}
              </div>

              <div className="inputBox">
                <input
                  className="fill"
                  type={showPasswords.password1 ? `text` : `password`}
                  {...register("password", {
                    required: "password is required",
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                      message: `at least 8 characters, must contain uppercase letter, lowercase letter, number and special characters`,
                    },
                  })}
                  required
                />
                <label> password</label>
                <div onClick={() => handleTogglePassword("password1")}>
                  {showPasswords.password1 ? (
                    <IoEyeOffOutline />
                  ) : (
                    <IoEyeOutline />
                  )}
                </div>
                {errors.password && (
                  <p className="error password-err">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="inputBox">
                <input
                  className="fill"
                  type={showPasswords.password2 ? `text` : `password`}
                  {...register("confirmPassword", {
                    required: "confirm password is required",
                    validate: (value, formValues) =>
                      value === formValues.password || "password not matching",
                  })}
                  required
                />
                <label> confirm password</label>
                <div onClick={() => handleTogglePassword("password2")}>
                  {showPasswords.password2 ? (
                    <IoEyeOffOutline />
                  ) : (
                    <IoEyeOutline />
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="error"> {errors.confirmPassword.message}</p>
                )}
              </div>

              <Controller
                control={control}
                name="file-area"
                render={({ field }) => (
                  <div className="avatar-container">
                    <img src={previewImage} alt="avatar" />
                    <input
                      id="file"
                      className="avatar-input"
                      accept="image/*"
                      type="file"
                      name="file"
                      onChange={(e) => {
                        field.onChange(e);
                        handleAvatar(e);
                      }}
                    />
                  </div>
                )}
              />

              <button type="submit">Sign up</button>
            </form>
            <div className="login">
              <span>Already have account?</span>{" "}
              <Link to="/login" className="link">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
