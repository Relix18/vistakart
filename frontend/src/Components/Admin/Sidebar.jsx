import React, { useState } from "react";
import {
  MdAddBox,
  MdAddChart,
  MdDashboard,
  MdFlag,
  MdHome,
  MdLibraryBooks,
  MdOutlineBrandingWatermark,
  MdOutlineCategory,
  MdOutlineCreate,
  MdPeople,
  MdRateReview,
} from "react-icons/md";
import { FaBars } from "react-icons/fa";
import img from "../../assets/LOGO_BLACK.png";
import "../../styles/Sidebar.scss";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const TreeNode = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`tree-node`}>
      <div className="node-label" onClick={toggleOpen}>
        {isOpen ? "-" : "+"} {label}
      </div>
      <div className="node-children">
        {isOpen && <div className="children-content">{children}</div>}
      </div>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div id="sidebar">
      <img src={img} />
      <Link to={"/"}>
        <MdHome />
        Home
      </Link>
      <Link to={"/admin/dashboard"}>
        <MdDashboard />
        Dashboard
      </Link>

      <TreeNode label="Banners">
        <div className="subTree">
          <Link to={"/admin/banners"}>
            {" "}
            <span>
              {" "}
              <MdFlag /> All{" "}
            </span>
          </Link>
        </div>
        <div className="subTree">
          <Link to={"/admin/banner/new"}>
            <span>
              <MdAddBox /> Add
            </span>
          </Link>
        </div>
      </TreeNode>
      <TreeNode label="Products">
        <div className="subTree">
          <Link to={"/admin/products"}>
            {" "}
            <span>
              {" "}
              <MdAddChart /> All{" "}
            </span>
          </Link>
        </div>
        <div className="subTree">
          <Link to={"/admin/product/new"}>
            <span>
              <MdOutlineCreate /> Create
            </span>
          </Link>
        </div>
        <div className="subTree">
          <Link to={"/admin/product/new/category"}>
            <span>
              <MdOutlineCategory /> Category
            </span>
          </Link>
        </div>
        <div className="subTree">
          <Link to={"/admin/product/new/brand"}>
            <span>
              <MdOutlineBrandingWatermark /> Brand
            </span>
          </Link>
        </div>
      </TreeNode>
      <Link to={"/admin/orders"}>
        <MdLibraryBooks />
        Orders
      </Link>
      <Link to={"/admin/users"}>
        <MdPeople />
        Users
      </Link>
      <Link to={"/admin/reviews"}>
        <MdRateReview />
        Reviews
      </Link>
    </div>
  );
};

export default Sidebar;

export const SidebarMobile = ({ isOpen }) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{
            x: "-100%",
          }}
          animate={{ x: "0%" }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.2 }}
          id="sidebarMobile"
        >
          <img src={img} />
          <Link to={"/"}>
            <MdHome />
            Home
          </Link>
          <Link to={"/admin/dashboard"}>
            <MdDashboard />
            Dashboard
          </Link>
          <TreeNode label="Banners">
            <div className="subTree">
              <Link to={"/admin/banners"}>
                {" "}
                <span>
                  {" "}
                  <MdFlag /> All{" "}
                </span>
              </Link>
            </div>
            <div className="subTree">
              <Link to={"/admin/banner/new"}>
                <span>
                  <MdAddBox /> Add
                </span>
              </Link>
            </div>
          </TreeNode>
          <TreeNode label="Products">
            <div className="subTree">
              <Link to={"/admin/products"}>
                {" "}
                <span>
                  {" "}
                  <MdAddChart /> All{" "}
                </span>
              </Link>
            </div>
            <div className="subTree">
              <Link to={"/admin/product/new"}>
                <span>
                  <MdOutlineCreate /> Create
                </span>
              </Link>
            </div>
            <div className="subTree">
              <Link to={"/admin/product/new/category"}>
                <span>
                  <MdOutlineCategory /> Category
                </span>
              </Link>
            </div>
            <div className="subTree">
              <Link to={"/admin/product/new/brand"}>
                <span>
                  <MdOutlineBrandingWatermark /> Brand
                </span>
              </Link>
            </div>
          </TreeNode>
          <Link to={"/admin/orders"}>
            <MdLibraryBooks />
            Orders
          </Link>
          <Link to={"/admin/users"}>
            <MdPeople />
            Users
          </Link>
          <Link to={"/admin/reviews"}>
            <MdRateReview />
            Reviews
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
