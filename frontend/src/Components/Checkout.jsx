import "../styles/Checkout.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAsync,
  itemsByUserIdAsync,
  selectItems,
} from "../redux/cart/cartSlice";
import logo from "../assets/contact.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { State } from "country-state-city";
import toast from "react-hot-toast";
import { createOrderAsync, selectOrderPlaced } from "../redux/order/orderSlice";
import { useForm } from "react-hook-form";
import {
  addUserAddressAsync,
  fetchUserAddressAsync,
  selectUserAddress,
  selectUserInfo,
  userStatus,
} from "../redux/user/userSlice";
import { ThreeDots } from "react-loader-spinner";

import { paymentGenerate, paymentKey } from "../redux/payment/paymentAPI";
import { zipCodes } from "./utils/common";
const Checkout = () => {
  const [address, setAddress] = useState(null);
  const [payment, setPayment] = useState("cod");
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const user = useSelector(selectUserInfo);
  const order = useSelector(selectOrderPlaced);
  const status = useSelector(userStatus);
  const navigate = useNavigate();
  const states = State.getStatesOfCountry("IN");
  const sum =
    items &&
    items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

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
  const addresses = useSelector(selectUserAddress);
  const totalItems = items.reduce((amount, item) => item.quantity + amount, 0);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    dispatch(fetchUserAddressAsync());
  }, [dispatch]);

  useEffect(() => {
    if (items.length === 0) {
      navigate("/");
    }
  }, [navigate]);

  const handleProceed = async () => {
    if (!address) {
      toast.error("Please select an address");
      return;
    }

    const zip = address.address.zip;

    if (zipCodes.includes(zip.toString())) {
      if (payment === "cod") {
        const orderDetail = {
          items,
          total,
          totalItems,
          paymentMethod: payment,
          user: address.user,
          shippingInfo: address.address,
          orderStatus: "pending",
        };
        await dispatch(createOrderAsync(orderDetail));

        return;
      } else {
        razorpayPayment();
      }
    } else {
      toast.error("Service not available in your area");
    }
  };

  const razorpayPayment = async () => {
    const { key } = await paymentKey();

    const { order } = await paymentGenerate({ amount: total });

    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "VistaKart",
      description: "Test Transaction",
      image: logo,
      order_id: order.id,
      callback_url: `${window.location.origin}/api/v1/paymentverification`,
      prefill: {
        name: user.name,
        email: user.email,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      notify: {
        sms: true,
      },
      theme: {
        color: "#2874f0",
      },
    };
    const razor = new window.Razorpay(options);

    razor.open();

    const orderDetail = {
      items,
      total,
      totalItems,
      paymentId: order.id,
      paymentMethod: payment,
      user: address.user,
      shippingInfo: address.address,
      orderStatus: "pending",
    };

    dispatch(createOrderAsync(orderDetail));
  };

  const handleAddress = (e) => {
    setAddress(addresses[e.target.value]);
  };

  const handlePayment = (e) => {
    setPayment(e.target.value);
  };

  return (
    <>
      {order && order.paymentMethod === "cod" && (
        <Navigate to={`/order-success/${order._id}`} />
      )}
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
        <div id="Checkout">
          <div>
            <div className="address-section ">
              {addresses && addresses.length === 0 ? (
                <form
                  noValidate
                  onSubmit={handleSubmit(async (data) => {
                    await dispatch(addUserAddressAsync(data));
                    dispatch(fetchUserAddressAsync());
                    reset();
                  })}
                >
                  <div className="form-section">
                    <h1>Address Information</h1>
                    <p>Use a permanent address where you can receive mail</p>
                    <div className="form">
                      <div>
                        <label className="label" htmlFor="name">
                          Full name
                        </label>
                        <div className="name-input sec-1">
                          <input
                            type="text"
                            id="name"
                            {...register("name", {
                              required: "name is required",
                            })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="label" htmlFor="email">
                          Email
                        </label>
                        <div className="email-input sec-1">
                          <input
                            id="email"
                            type="text"
                            {...register("email", {
                              required: "email is required",
                            })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="label" htmlFor="phone">
                          Phone
                        </label>
                        <div className="phone-input">
                          <input
                            type="number"
                            id="phone"
                            {...register("phone", {
                              required: "phone number is required",
                            })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="label" htmlFor="street">
                          Street address
                        </label>
                        <div className="street-input">
                          <input
                            type="text"
                            id="street"
                            {...register("street", {
                              required: "street address is required",
                            })}
                          />
                        </div>
                      </div>

                      <div className="main-col">
                        <div className="col">
                          <label className="label">City</label>
                          <div className="col-input">
                            <input
                              id="city"
                              type="text"
                              {...register("city", { required: true })}
                            />
                          </div>
                        </div>
                        <div className="col">
                          <label className="label" htmlFor="state">
                            State
                          </label>
                          <div className="select">
                            <select
                              id="state"
                              {...register("state", { required: true })}
                            >
                              {states.map((state, index) => (
                                <option key={index} value={state.name}>
                                  {state.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col">
                          <label className="label" htmlFor="zip">
                            ZIP / Postal Code
                          </label>
                          <div className="col-input">
                            <input
                              type="number"
                              id="zip"
                              {...register("zip", { required: true })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="add-btn" type="submit">
                      Add Address
                    </button>
                  </div>
                </form>
              ) : (
                <div className="address-container">
                  <h1>Address</h1>
                  <p className="p">Choose the address you want to use</p>
                  <button
                    className="add-btn"
                    onClick={() => navigate("/profile")}
                  >
                    Change
                  </button>
                  {addresses &&
                    addresses.map((i, index) => (
                      <div className="address" key={index}>
                        <input
                          type="radio"
                          name="address-radio"
                          onChange={handleAddress}
                          value={index}
                          id={`address-radio${index}`}
                        />
                        <label htmlFor={`address-radio${index}`}></label>
                        <div className="row">
                          <div className="col-1">
                            <p className="name-p">{i.address.name}</p>
                            <p className="address-p">{i.address.street}</p>
                            <p className="pin-p">{i.address.zip}</p>
                          </div>
                          <div className="col-2">
                            <p className="phone-p">Phone: {i.address.phone}</p>
                            <p className="city-p">{i.address.city}</p>
                            <p className="state-p">{i.address.state}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              <div className="payment-option">
                <div>
                  <input
                    type="radio"
                    name="payment"
                    value={"cod"}
                    onChange={handlePayment}
                    id="payment1"
                    checked={payment === "cod"}
                  />
                  <label htmlFor="payment1">Cash on Delivery</label>
                </div>
                <div>
                  <input
                    type="radio"
                    value={"online"}
                    onChange={handlePayment}
                    name="payment"
                    id="payment2"
                  />
                  <label htmlFor="payment2">Online Payment</label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="item-section">
              <h1>Cart</h1>
              <div className="item-container">
                <div className="items">
                  {items.map((item, index) => (
                    <CheckoutCart
                      key={index}
                      id={item._id}
                      thumbnail={item.product.thumbnail.url}
                      title={item.product.name}
                      price={Math.floor(
                        item.product.price -
                          (item.product.price *
                            item.product.discountPercentage) /
                            100
                      )}
                      brand={item.product.brand}
                      qty={item.quantity}
                      stock={item.product.stock}
                    />
                  ))}
                </div>
                <div className="summary">
                  <div>
                    <h3>Subtotal</h3>
                    <h3>Total Items</h3>
                  </div>
                  <div>
                    <h3>₹{total}</h3>
                    <h3>{totalItems}</h3>
                  </div>
                </div>
                <p className="p-summary">Shipping and taxes included.</p>
                <button className="order-btn" onClick={handleProceed}>
                  Proceed
                </button>
                <Link to="/" className="continue-btn">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CheckoutCart = ({ id, thumbnail, title, price, brand, qty, stock }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);

  const deleteHandler = async () => {
    await dispatch(deleteAsync(id));
    dispatch(itemsByUserIdAsync(user._id));
    toast.success("Item Removed");
  };

  return (
    <div className="item">
      <div className="details">
        <img src={thumbnail} alt="" />
        <div className="item-details">
          <p className="item-name">{title}</p>
          <p className="item-brand">{brand}</p>
          <p className="price-p">₹{price}</p>
        </div>
      </div>

      <div className="remove">
        <button onClick={() => deleteHandler()}>Remove</button>
      </div>
    </div>
  );
};

export default Checkout;
