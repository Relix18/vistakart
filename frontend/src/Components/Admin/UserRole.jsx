import React, { useEffect, useState } from "react";
import Sidebar, { SidebarMobile } from "./Sidebar";
import "../../styles/UserRole.scss";
import { useDispatch, useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import {
  MdAdminPanelSettings,
  MdApartment,
  MdArticle,
  MdCategory,
  MdDataUsage,
  MdDiscount,
  MdEmail,
  MdFontDownload,
  MdOutlinePriceCheck,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchUserByIdAsync,
  selectUserInfo,
  selectUserRole,
  updateUserRoleAsync,
} from "../../redux/user/userSlice";
import { FaBars } from "react-icons/fa";

const UserRole = () => {
  const user = useSelector(selectUserRole);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchUserByIdAsync(params.id));
  }, [dispatch]);

  useEffect(() => {
    setValue("name", user && user.name);
    setValue("email", user && user.email);
    setValue("role", user && user.role);
  }, [user, setValue]);

  return (
    <div id="editUser" className={show ? "lock-scrollbar" : ""}>
      <Sidebar />
      <div id="toggleBtn" onClick={() => setShow(!show)}>
        <FaBars />
      </div>
      <SidebarMobile isOpen={show} />
      <div className="editUserContainer">
        <form
          noValidate
          onSubmit={handleSubmit(async (data) => {
            await dispatch(
              updateUserRoleAsync({ role: data.role, id: params.id })
            );
            reset();
            navigate("/admin/users");
          })}
        >
          <h1>Update Role</h1>
          <div className="form-section">
            <div className="form">
              <div className="input">
                <MdFontDownload />
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  {...register("name", {
                    required: "name is required",
                  })}
                  readOnly
                />
              </div>

              <div className="input">
                <MdEmail />
                <input
                  type="text"
                  id="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "email is required",
                  })}
                  readOnly
                />
              </div>

              <div className="input">
                <MdAdminPanelSettings />
                <select
                  id="role"
                  {...register("role", {
                    required: "role is required",
                  })}
                >
                  <option value={user && user.role}>{user && user.role}</option>
                  {user && user.role !== "admin" && (
                    <option value="admin">admin</option>
                  )}
                </select>
              </div>
            </div>
            <button
              disabled={user && user.role === "admin"}
              className="create-btn"
              type="submit"
            >
              Update Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRole;
