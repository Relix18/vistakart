import React, { useState } from "react";
import SideBar, { SidebarMobile } from "./Sidebar";
import "../../styles/Brand.scss";
import { useForm } from "react-hook-form";
import { MdApartment, MdCategory } from "react-icons/md";
import { useDispatch } from "react-redux";
import { createBrandAsync } from "../../redux/product/productSlice";
import { FaBars } from "react-icons/fa";

const Brand = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm();

  return (
    <div id="brandAdmin" className={show ? "lock-scrollbar" : ""}>
      <SideBar />
      <div id="toggleBtn" onClick={() => setShow(!show)}>
        <FaBars />
      </div>
      <SidebarMobile isOpen={show} />
      <div className="brandContainer">
        <form
          noValidate
          onSubmit={handleSubmit((data) => {
            dispatch(createBrandAsync(data));
            reset();
          })}
        >
          <div className="form-section">
            <h1>Add Brand</h1>
            <div className="form">
              <div className="input">
                <MdApartment />
                <input
                  type="text"
                  id="brand"
                  placeholder="Brand Name"
                  {...register("label", {
                    required: "label is required",
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

export default Brand;
