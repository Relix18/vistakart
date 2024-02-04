import React, { useState } from "react";
import SideBar, { SidebarMobile } from "./Sidebar";
import "../../styles/Category.scss";
import { useForm } from "react-hook-form";
import { MdCategory } from "react-icons/md";
import toast from "react-hot-toast";
import { createCategoryAsync } from "../../redux/product/productSlice";
import { useDispatch } from "react-redux";
import { FaBars } from "react-icons/fa";

const Category = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm();

  return (
    <div id="categoryAdmin" className={show ? "lock-scrollbar" : ""}>
      <SideBar />
      <div id="toggleBtn" onClick={() => setShow(!show)}>
        <FaBars />
      </div>
      <SidebarMobile isOpen={show} />
      <div className="categoryContainer">
        <form
          noValidate
          onSubmit={handleSubmit((data) => {
            dispatch(createCategoryAsync(data));
            reset();
            toast.success("Category Added");
          })}
        >
          <div className="form-section">
            <h1>Add Caterogy</h1>
            <div className="form">
              <div className="input">
                <MdCategory />
                <input
                  type="text"
                  id="category"
                  placeholder="Category Name"
                  {...register("label", {
                    required: "category is required",
                  })}
                />
              </div>
              <p>Please Type First Letter Capital e.g. (Books) </p>
            </div>
            <button type="submit" className="create-btn">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Category;
