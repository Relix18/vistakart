import { Carousel } from "react-responsive-carousel";
import "../styles/ProductDetails.scss";
import { useDispatch, useSelector } from "react-redux";
import StarRatings from "react-star-ratings";
import {
  productByIdAsync,
  productReviewAsync,
  productStatus,
  selectProductById,
} from "../redux/product/productSlice";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { zipCodes } from "./utils/common.jsx";
import {
  addAsync,
  itemsByUserIdAsync,
  resetCartAsync,
  selectItems,
} from "../redux/cart/cartSlice";
import toast from "react-hot-toast";
import { selectUserInfo } from "../redux/user/userSlice";
import { IoPersonOutline } from "react-icons/io5";
import { Rings, ThreeDots } from "react-loader-spinner";
import Modal from "react-modal";

const ProductDetails = () => {
  const [zipSearch, setZipSearch] = useState("");
  const [zipRes, setZipRes] = useState("");
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const contentRef = useRef(null);
  const { product } = useSelector(selectProductById);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const user = useSelector(selectUserInfo);
  const status = useSelector(productStatus);

  useEffect(() => {
    dispatch(productByIdAsync(params.id));
    {
      user && dispatch(itemsByUserIdAsync(user.id));
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [dispatch, params.id, user]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [show]);

  const p = document.querySelector(".pin-res");
  const stock = document.querySelector(".stock");

  zipRes === "Available" ? p.classList.add("green") : "";
  zipRes === "Not Available" ? p.classList.remove("green") : "";

  if (stock) {
    if (product && product.stock > 0) {
      stock.classList.remove("red");
    } else {
      stock.classList.add("red");
    }
  }

  const ratingOptions = {
    rating: product && product.ratings,
    starRatedColor: "#ffd700",
    numberOfStars: 5,
    name: "star",
    starDimension: "20px",
    starSpacing: "1px",
  };

  const submitReviewHandler = async () => {
    if (user) {
      const review = {
        rating: rating,
        comment: comment,
        productId: params.id,
      };
      await dispatch(productReviewAsync(review));
      dispatch(productByIdAsync(product._id));
      setShow(false);
      toast.success("Review Added");
    } else {
      toast.error("Please Login First");
    }
  };

  const scrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const zipCheckHandler = () => {
    if (zipCodes.includes(zipSearch)) {
      setZipRes("Available");
    } else {
      setZipRes("Not Available");
    }
  };

  const buyNowHandler = async (product) => {
    if (!user) {
      toast.error("Please Login First");
    } else {
      await dispatch(resetCartAsync());
      const newItem = { productId: product._id, quantity: 1 };
      await dispatch(addAsync(newItem));
      navigate("/checkout");
    }
  };

  const addToCartHandler = (product) => {
    if (user) {
      if (items.findIndex((i) => i.product._id === product._id) < 0) {
        const newItem = { productId: product._id, quantity: 1 };
        dispatch(addAsync(newItem));
        toast.success("Added To Cart");
      } else {
        toast.error("Item Already Added");
      }
    } else {
      toast.error("Please Login First");
    }
  };

  return (
    <>
      {status === "loading" ? (
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
        <div id="ProductDetails">
          {product && (
            <div className="container">
              <div className="imgSlide">
                <Carousel
                  className="carousel"
                  autoPlay={false}
                  showArrows={false}
                  interval={3000}
                  infiniteLoop={true}
                  showIndicators={true}
                  showStatus={false}
                >
                  {product.images.map((img, i) => (
                    <div key={i}>
                      <img src={img.url} alt="banner" />
                    </div>
                  ))}
                </Carousel>
              </div>
              <div className="mobileSlide">
                <Carousel
                  className="carousel"
                  autoPlay={false}
                  showArrows={false}
                  showIndicators={true}
                  showStatus={false}
                  showThumbs={false}
                >
                  {product.images.map((img, i) => (
                    <div key={i}>
                      <img src={img.url} alt="banner" />
                    </div>
                  ))}
                </Carousel>
              </div>
              <div className="details">
                <h1 className="title">{product.name}</h1>
                <h3>
                  By {product.brand}
                  <span className="rating" onClick={scrollToContent}>
                    <div className="desktop-star">
                      <StarRatings {...ratingOptions} />({product.numOfReview}{" "}
                      reviews)
                    </div>
                    <div className="mobile-star">
                      <StarRatings {...ratingOptions} starDimension="15px" />(
                      {product.numOfReview} reviews)
                    </div>
                  </span>
                </h3>
                <div className="product-price">
                  <h2>
                    ₹
                    {Math.floor(
                      product.price -
                        (product.price * product.discountPercentage) / 100
                    )}
                    <span>₹{product.price}</span>
                  </h2>
                  <h4>{product.discountPercentage}% off</h4>
                </div>
                <div className="stock">
                  {product.stock > 0 ? "InStock" : "Out of Stock"}
                </div>
                <div className="prod-desc">
                  <h1>Product Details</h1>
                  <p>{product.description}</p>
                </div>
                <div className="pin-check">
                  <p>Delivery</p>
                  <div className="pin-input">
                    <input
                      type="number"
                      className="checkInput"
                      onChange={(e) =>
                        setZipSearch(e.target.value.substring(0, 6))
                      }
                      value={zipSearch}
                      placeholder="Pincode"
                    />
                    <button
                      className="checkBtn"
                      onClick={() => zipCheckHandler()}
                    >
                      Check
                    </button>
                  </div>
                  <p className="pin-res">{zipRes}</p>
                </div>
                <div className="flex-button">
                  <div className="main-button">
                    <button
                      disabled={product.stock <= 0}
                      onClick={() => buyNowHandler(product)}
                      className="buyBtn"
                    >
                      Buy now
                    </button>
                    <button onClick={() => addToCartHandler(product)}>
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="reviews" ref={contentRef}>
            <h1>Reviews</h1>
            <div className="main-star">
              <div className="desktop-star">
                <StarRatings {...ratingOptions} starDimension="30px" />
                <p>{product && product.ratings.toFixed(1)}</p>
                <button onClick={() => setShow(true)}>Submit review</button>
              </div>
              <div className="mobile-star">
                <StarRatings {...ratingOptions} starDimension="20px" />
                <p>{product && product.ratings.toFixed(1)}</p>
              </div>
              <button onClick={() => setShow(true)}>Submit review</button>
            </div>
            {product &&
              product.review.length > 0 &&
              product.review.map((review, i) => (
                <div className="review-card">
                  <p className="user-name">
                    <img src={review.avatar} />
                    {review.name}
                  </p>
                  <StarRatings
                    {...ratingOptions}
                    rating={review.rating}
                    starDimension="20px"
                  />
                  <p className="user-comment">{review.comment}</p>
                </div>
              ))}
          </div>

          <Modal
            isOpen={show}
            onRequestClose={() => setShow(false)}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 999,
              },
              content: {
                width: "60%",
                height: "40%",
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
            <div className="review-container">
              <StarRatings
                {...ratingOptions}
                rating={rating}
                changeRating={(e) => setRating(e)}
                starHoverColor="#ffd700"
                starDimension="30px"
              />
              <textarea
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                className="comment"
                placeholder="Write a review"
              />
              <div className="review-button">
                <button className="cancel" onClick={() => setShow(false)}>
                  Cancel
                </button>
                <button
                  className="submit"
                  onClick={() => submitReviewHandler()}
                >
                  Submit
                </button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
