import React, { useEffect, useState } from "react";
import Sidebar, { SidebarMobile } from "./Sidebar";
import "../../styles/Banner.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  bannerAsync,
  deleteBannerAsync,
  selectBanner,
} from "../../redux/product/productSlice";
import { MdDelete } from "react-icons/md";
import { FaBars } from "react-icons/fa";
import Modal from "react-modal";

const Banner = () => {
  const dispatch = useDispatch();
  const { banners } = useSelector(selectBanner);
  const [show, setShow] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleDeleteConfirmation = (bannerId) => {
    setSelectedBannerId(bannerId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (selectedBannerId) {
      await dispatch(deleteBannerAsync(selectedBannerId));
      dispatch(bannerAsync());
      setDeleteConfirmationOpen(false);
      setSelectedBannerId(null);
    }
  };

  useEffect(() => {
    dispatch(bannerAsync());
  }, []);
  return (
    <>
      <Modal
        isOpen={isDeleteConfirmationOpen}
        onRequestClose={() => setDeleteConfirmationOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "50%",
            height: "150px",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "500",
          },
        }}
      >
        <p>Are you sure you want to delete this banner?</p>
        <div className="modal-buttons-container">
          <button
            className={`modal-button delete-button`}
            onClick={() => handleDeleteConfirmed()}
          >
            Yes
          </button>
          <button
            className="modal-button"
            onClick={() => setDeleteConfirmationOpen(false)}
          >
            No
          </button>
        </div>
      </Modal>
      <div id="banner" className={show ? "lock-scrollbar" : ""}>
        <Sidebar />
        <div id="toggleBtn" onClick={() => setShow(!show)}>
          <FaBars />
        </div>
        <SidebarMobile isOpen={show} />
        <div className="bannerContainer">
          <div className="banner">
            <h1>Banners</h1>
            {banners &&
              banners.map((i) => (
                <div key={i._id} className="bannerItem">
                  <img src={i.url} alt="banner" />
                  <div className="deleteIcon">
                    <MdDelete onClick={() => handleDeleteConfirmation(i._id)} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
