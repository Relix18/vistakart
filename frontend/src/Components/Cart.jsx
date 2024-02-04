import { useEffect, useState } from "react";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import "../styles/Cart.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  cartStatus,
  deleteAsync,
  itemsByUserIdAsync,
  selectItems,
  updateAsync,
} from "../redux/cart/cartSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { selectUserInfo } from "../redux/user/userSlice";
import { ThreeDots } from "react-loader-spinner";

const Cart = () => {
  const items = useSelector(selectItems);
  const dispatch = useDispatch();
  const status = useSelector(cartStatus);
  const user = useSelector(selectUserInfo);
  const sum = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const totalDiscount = items.reduce(
    (acc, item) =>
      acc +
      item.product.price * item.quantity -
      Math.floor(
        item.product.price -
          (item.product.price * item.product.discountPercentage) / 100
      ) *
        item.quantity,
    0
  );

  const subTotal = sum;
  const shipping = subTotal > 500 ? 0 : 50;
  const total = subTotal - totalDiscount + shipping;

  const navigate = useNavigate();

  const checkoutHandler = () => {
    if (items.length <= 0) {
      toast.error("Please add items to checkout");
    } else {
      navigate("/checkout");
    }
  };

  useEffect(() => {
    {
      user && dispatch(itemsByUserIdAsync(user.id));
    }
  }, [dispatch, user]);

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
        <div id="Cart">
          <div>
            <div className="items box">
              <h3>Shopping Cart</h3>
              {items.length > 0 ? (
                items.map((i) => (
                  <Card
                    thumbnail={i.product.thumbnail.url}
                    name={i.product.name}
                    price={i.product.price}
                    discountPrice={Math.floor(
                      i.product.price -
                        (i.product.price * i.product.discountPercentage) / 100
                    )}
                    discountPercentage={i.product.discountPercentage}
                    qty={i.quantity}
                    brand={i.product.brand}
                    key={i._id}
                    id={i._id}
                    stock={i.product.stock}
                    leftIcon={<IoMdArrowDropleft />}
                    rightIcon={<IoMdArrowDropright />}
                  />
                ))
              ) : (
                <div id="emptyCart">
                  <h2>Your Cart is empty</h2>
                </div>
              )}
            </div>
          </div>
          <div>
            <div id="price">
              <h3>Price Details</h3>
              <div className="details">
                <table>
                  <tbody>
                    <tr>
                      <td>Sub Total</td>
                      <td className="value">₹{subTotal}</td>
                    </tr>
                    <tr>
                      <td>Discount</td>
                      <td className="discount value">- ₹{totalDiscount}</td>
                    </tr>
                    <tr>
                      <td>Delivery Charges</td>
                      <td className="value">₹{shipping}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="total">
                <table>
                  <thead>
                    <tr>
                      <td>Total Amount</td>
                      <td className="value">₹{total}</td>
                    </tr>
                  </thead>
                </table>
              </div>

              <button onClick={() => checkoutHandler()}>Checkout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Card = ({
  thumbnail,
  name,
  price,
  discountPercentage,
  discountPrice,
  brand,
  stock,
  id,
  qty,
  leftIcon,
  rightIcon,
}) => {
  const [quant, setQuant] = useState(qty);
  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);

  const updateQuantity = async (newQuantity) => {
    setQuant(newQuantity);
    await dispatch(updateAsync({ id, quantity: newQuantity }));
    dispatch(itemsByUserIdAsync(user._id));
  };

  const increment = () => {
    if (stock > quant) {
      setQuant((prevQuant) => prevQuant + 1);
      updateQuantity(quant + 1);
    }
  };

  const decrement = () => {
    if (quant > 1) {
      setQuant((prevQuant) => prevQuant - 1);
      updateQuantity(quant - 1);
    }
  };

  const deleteHandler = async () => {
    await dispatch(deleteAsync(id));
    dispatch(itemsByUserIdAsync(user._id));
    toast.success("Item Removed");
  };

  return (
    <div className="itemCard">
      <div className="itemDetail-1">
        <img src={thumbnail} alt="" />
        <div className="pClass">
          <p className="productName">{name}</p>
          <p className="productBrand">{brand}</p>

          <div className="price">
            ₹{discountPrice}
            <p className="amount">₹{price}</p>
          </div>
          <h4>{discountPercentage}% off</h4>
        </div>
      </div>
      <div className="itemDetail-2">
        <div className="quantityBtn">
          <div onClick={() => decrement(id)}>{leftIcon}</div>
          <p className="quantity">{quant} </p>
          <div onClick={() => increment(id)}>{rightIcon}</div>
        </div>
        <div className="buttons">
          <button onClick={deleteHandler} className="btn2">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
