import { useEffect, useRef, useState } from "react";
import "../styles/Navbar.scss";
import logo from "../assets/LOGO_BLACK.png";
import { BsCart3 } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { IoClose, IoLocationSharp } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectItems } from "../redux/cart/cartSlice";
import { AnimatePresence, motion } from "framer-motion";
import { zipCodes } from "./utils/common.jsx";
import { authenticated, selectUserInfo } from "../redux/user/userSlice.js";
import {
  productAsync,
  productsCategoryAsync,
  selectBrands,
  selectCategories,
} from "../redux/product/productSlice";

const Navbar = () => {
  const [searches, setSearches] = useState("");
  const [toggle, setToggle] = useState(false);
  const [zipCodeToggle, setZipCodeToggle] = useState(false);
  const [zipSearch, setZipSearch] = useState("");
  const [zipRes, setZipRes] = useState("");
  const [showUser, setShowUser] = useState(false);
  const dispatch = useDispatch();
  const divRef = useRef();
  const zipRef = useRef();
  const { search } = useParams();
  const clearSearch = useRef("");
  const navigate = useNavigate();
  const user = useSelector(selectUserInfo);
  const auth = useSelector(authenticated);
  const { categories } = useSelector(selectCategories);
  const { brands } = useSelector(selectBrands);

  const p = document.querySelector(".pin-res");

  zipRes === "Available" ? p.classList.add("green") : "";
  zipRes === "Not Available" ? p.classList.remove("green") : "";

  const items = useSelector(selectItems);

  useEffect(() => {
    if (toggle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [toggle]);

  const [isNavbarVisible, setNavbarVisibility] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrolledUp = prevScrollPos > currentScrollPos;
      const navbarHeight = 180;

      if (currentScrollPos > navbarHeight) {
        setNavbarVisibility(isScrolledUp);
      } else {
        setNavbarVisibility(true);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const burgerHandler = (e) => {
    e.stopPropagation();
    setToggle(!toggle);
  };

  const zipCheckHandler = () => {
    if (zipCodes.includes(zipSearch)) {
      setZipRes("Available");
    } else {
      setZipRes("Not Available");
    }
  };

  const searchButtonHandle = async () => {
    if (searches === "") {
      return;
    }
    navigate("/search/" + searches);
  };

  useEffect(() => {
    document.addEventListener("mousedown", userHandle);
    document.addEventListener("mousedown", zipHandle);
  }, []);

  const userHandle = (e) => {
    if (divRef.current && !divRef.current.contains(e.target)) {
      setShowUser(false);
    }
  };

  const zipHandle = (e) => {
    if (zipRef.current && !zipRef.current.contains(e.target)) {
      setZipCodeToggle(false);
    }
  };

  const categoryHandler = (e) => {
    if (e.target.value === "Shop by category") {
      return;
    }
    let category = [e.target.value];
    setToggle(false);
    dispatch(productAsync({ search, filter: { category } }));
  };

  const mobileCategoryHandler = (label) => {
    let category = [label];
    setToggle(false);
    dispatch(productAsync({ search, filter: { category } }));
  };
  const brandHandler = (label) => {
    let brand = [label];
    setToggle(false);
    dispatch(productAsync({ search, filter: { brand } }));
  };

  return (
    <div id="Navbar" className={isNavbarVisible ? "" : "hidden"}>
      <AnimatePresence mode="wait">
        {toggle && (
          <motion.div
            initial={{
              x: "-100%",
            }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.2 }}
            className="burger-navbar"
          >
            <div className="close">
              <IoClose onClick={() => setToggle(false)} />
            </div>
            <div className="logo-div">
              <img src={logo} alt="Logo" className="logo" />
            </div>
            <motion.div
              initial={{
                opacity: 0,
                x: "-20%",
              }}
              animate={{ opacity: 1, x: "0%" }}
              exit={{ opacity: 0, x: "-20%" }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="filter"
            >
              <div name="category" id="category">
                <h2> Category </h2>
                {categories &&
                  categories.map((item) => (
                    <li
                      key={item.value}
                      onClick={() => mobileCategoryHandler(item.label)}
                      value={item.value}
                    >
                      {item.label}
                    </li>
                  ))}
              </div>

              <div name="brand" id="brand" className="brand">
                <h2> Brand </h2>
                {brands &&
                  brands.map((item) => (
                    <li
                      key={item.value}
                      onClick={() => brandHandler(item.label)}
                      value={item.value}
                    >
                      {item.label}
                    </li>
                  ))}
              </div>
            </motion.div>
            <Link to={"/contactus"} onClick={() => setToggle(false)}>
              <button className="contactBtn">Contact Us</button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="desktop-container">
        <div className="logo-menu">
          <GiHamburgerMenu
            onClick={(e) => burgerHandler(e)}
            className="menuIcon"
          />
          <Link to={"/"} className="logo">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="navbar">
          <div className="inputs">
            <div className="searchInput">
              <input
                type="search"
                ref={clearSearch}
                placeholder="Search for products..."
                className="searchBox"
                onChange={(e) => {
                  setSearches(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchButtonHandle();
                  }
                }}
              />
              <span
                className="searchIcon"
                onClick={(e) => searchButtonHandle(e)}
              >
                <IoIosSearch />
              </span>
            </div>
            <div className="hero-btn">
              <div className="location" ref={zipRef}>
                <span className="locationIcon"></span>

                <div
                  className="locationBtn"
                  onClick={() => {
                    setZipCodeToggle(!zipCodeToggle);
                  }}
                >
                  <IoLocationSharp className="locationIcon" />
                  <span>See locations</span>
                </div>
                <AnimatePresence mode="wait">
                  {zipCodeToggle && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        transformOrigin: "top right",
                        scale: 0.9,
                      }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="checkOption"
                    >
                      <input
                        type="number"
                        className="checkInput"
                        onChange={(e) =>
                          setZipSearch(e.target.value.substring(0, 6))
                        }
                        value={zipSearch}
                        placeholder="Enter Pincode"
                      />
                      <p
                        className="pin-res"
                        style={{ fontSize: "12px", marginLeft: "10px" }}
                      >
                        {zipRes}
                      </p>
                      <div className="butt">
                        <button
                          className="checkBtn"
                          onClick={() => zipCheckHandler()}
                        >
                          Check
                        </button>
                        <button
                          className="close"
                          onClick={() => {
                            setZipCodeToggle(false);
                            setZipSearch("");
                            setZipRes("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="otherIcon">
                <Link className="cart" to="/cart">
                  <BsCart3 />
                  <p>{auth ? items.length : 0}</p>
                </Link>
                <div ref={divRef} className="userIcon">
                  {auth ? (
                    <div onClick={() => setShowUser(!showUser)}>
                      <AiOutlineUser />
                    </div>
                  ) : (
                    <Link to="/login">
                      <AiOutlineUser />
                    </Link>
                  )}
                  <AnimatePresence mode="wait">
                    {showUser && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          transformOrigin: "top right",
                          scale: 0.9,
                        }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="user"
                      >
                        {user && (
                          <>
                            {user.role === "admin" && (
                              <div>
                                <Link className="account" to="/admin/dashboard">
                                  Dashboard
                                </Link>
                              </div>
                            )}
                            <div onClick={() => setShowUser(!showUser)}>
                              <Link className="account" to="/profile">
                                My Account
                              </Link>
                            </div>
                            <div onClick={() => setShowUser(!showUser)}>
                              <Link className="order" to="/orders">
                                My Orders
                              </Link>
                            </div>
                            <div onClick={() => setShowUser(!showUser)}>
                              <Link className="logout" to="/logout">
                                Sign out
                              </Link>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <div className="buttons">
            <select onChange={(e) => categoryHandler(e)}>
              <option>Shop by Category</option>
              {categories &&
                categories.map((category) => (
                  <option key={category.value}>{category.label}</option>
                ))}
            </select>
            <div className="catBtn">
              <button onClick={(e) => categoryHandler(e)} value={"Smartphones"}>
                Smartphones
              </button>
              <button onClick={(e) => categoryHandler(e)} value={"Laptop"}>
                Laptop
              </button>
              <button onClick={(e) => categoryHandler(e)} value={"Headphones"}>
                Headphones
              </button>
              <button onClick={(e) => categoryHandler(e)} value={"Smartwatch"}>
                Smartwatch
              </button>
            </div>
            <button
              className="contactBtn"
              onClick={() => navigate("/contactus")}
            >
              Contact
            </button>
          </div>
        </div>
      </div>
      <div className="mobileSearch">
        <input
          type="search"
          ref={clearSearch}
          placeholder="Search for products..."
          className="searchBox"
          onChange={(e) => {
            setSearches(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchButtonHandle();
            }
          }}
        />
        <span className="searchIcon" onClick={(e) => searchButtonHandle(e)}>
          <IoIosSearch />
        </span>
      </div>
    </div>
  );
};

export default Navbar;
