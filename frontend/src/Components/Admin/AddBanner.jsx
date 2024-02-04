import React, { useEffect, useState } from "react";
import Sidebar, { SidebarMobile } from "./Sidebar";
import "../../styles/AddBanner.scss";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import {
  addBannerAsync,
  bannerAsync,
  productStatus,
} from "../../redux/product/productSlice";
import { FaBars } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";

const AddBanner = () => {
  const dispatch = useDispatch();
  const loading = useSelector(productStatus);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [show, setShow] = useState(false);

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const handleBanner = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewBanner(reader.result);
        setValue("banner", reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setPreviewBanner(null);
    }
  };

  return (
    <>
      {loading === "loading" ? (
        <div id="loader">
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="#2874f0"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : (
        <div id="addBanner" className={show ? "lock-scrollbar" : ""}>
          <Sidebar />
          <div id="toggleBtn" onClick={() => setShow(!show)}>
            <FaBars />
          </div>
          <SidebarMobile isOpen={show} />
          <div className="addContainer">
            <form
              noValidate
              onSubmit={handleSubmit(async (data) => {
                await dispatch(addBannerAsync(data));
                dispatch(bannerAsync());
                setPreviewBanner([]);
                reset();
              })}
            >
              <div className="form-section">
                <h1>Add Banner</h1>
                <div className="form">
                  <Controller
                    control={control}
                    name="banner"
                    rules={{ required: "File is required" }}
                    render={({ field }) => (
                      <div className="file">
                        <input
                          id="file"
                          accept="image/*"
                          type="file"
                          name="banner"
                          className="file-input thumb"
                          onChange={(e) => {
                            field.onChange(e);
                            handleBanner(e);
                          }}
                        />
                        {errors.banner && (
                          <p className="error">{errors.banner.message}</p>
                        )}

                        <div className="preview">
                          {previewBanner && (
                            <img src={previewBanner} alt="preview" />
                          )}
                        </div>
                      </div>
                    )}
                  />
                </div>
                <button type="submit" className="create-btn">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBanner;
