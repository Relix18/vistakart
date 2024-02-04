import React, { useEffect, useState } from "react";
import Sidebar, { SidebarMobile } from "./Sidebar";
import "../../styles/OrderUpdate.scss";
import {
  fetchOrderByIdAsync,
  orderStatus,
  selectOrderById,
  updateOrderAsync,
} from "../../redux/order/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaTruckFast } from "react-icons/fa6";
import { Vortex } from "react-loader-spinner";
import { FaBars } from "react-icons/fa";

const OrderUpdate = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const order = useSelector(selectOrderById);
  const status = useSelector(orderStatus);
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchOrderByIdAsync(params.id));
  }, [dispatch]);

  return (
    <>
      {status === "loading" ? (
        <div id="loader">
          <Vortex
            visible={true}
            height="80"
            width="80"
            ariaLabel="vortex-loading"
            wrapperStyle={{}}
            wrapperClass="vortex-wrapper"
            colors={["red", "green", "blue", "yellow", "orange", "purple"]}
          />
        </div>
      ) : (
        <div id="orderUpdate" className={show ? "lock-scrollbar" : ""}>
          <Sidebar />
          <div id="toggleBtn" onClick={() => setShow(!show)}>
            <FaBars />
          </div>
          <SidebarMobile isOpen={show} />
          <div className="orderUpdateContainer">
            <div id="orderDetails">
              {order && (
                <>
                  <p
                    className={
                      order.orderStatus === "Delivered"
                        ? "green"
                        : order.orderStatus === "Shipped"
                        ? "yellow"
                        : "red"
                    }
                  >
                    Order Id: {order._id}
                  </p>
                  <div className="order">
                    {order &&
                      order.items.map((item) => (
                        <div key={item.product._id} className="products">
                          <img
                            src={item.product.thumbnail.url}
                            alt={item.product.name}
                          />
                          <div className="details">
                            <div>
                              <p className="productName">{item.product.name}</p>
                              <p className="productBrand">
                                {item.product.brand}
                              </p>
                              <p className="productQty">
                                Qty : {item.quantity}
                              </p>
                            </div>
                            <div>
                              <p className="productPrice">
                                {" "}
                                Price: ₹
                                {Math.floor(
                                  item.product.price -
                                    (item.product.price *
                                      item.product.discountPercentage) /
                                      100
                                )}
                              </p>
                              <p className="productTotal">
                                Total Price: ₹
                                {item.quantity *
                                  Math.floor(
                                    item.product.price -
                                      (item.product.price *
                                        item.product.discountPercentage) /
                                        100
                                  )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    <div className="summary">
                      <div className="col-1">
                        <p>Total Amount: ₹{order.total}</p>
                        <p>Order Date: {order.createdAt.slice(0, 10)}</p>
                        <p
                          className={
                            order.orderStatus === "Delivered"
                              ? `green-clr`
                              : order.orderStatus === "Shipped"
                              ? `yellow-clr`
                              : `red-clr`
                          }
                        >
                          Status: {order.orderStatus}
                        </p>
                      </div>
                      <div className="col-2">
                        <p>
                          Payment Method:{" "}
                          {order.paymentMethod === "online"
                            ? "Online"
                            : "Cash on Delivery"}
                        </p>

                        <p
                          className={
                            order.paymentStatus === "Paid"
                              ? `green-clr`
                              : `red-clr`
                          }
                        >
                          Payment Status: {order.paymentStatus}
                        </p>

                        {order.orderStatus === "Delivered" && (
                          <p>Delivered Date: {order.updatedAt.slice(0, 10)}</p>
                        )}
                      </div>
                    </div>

                    <div className="address">
                      <h2>Delivery Address</h2>
                      <div className="row">
                        <div className="col-1">
                          <p>{order.shippingInfo.name}</p>
                          <p> {order.shippingInfo.phone}</p>
                          <p> {order.shippingInfo.street}</p>
                        </div>
                        <div className="col-2">
                          <p> {order.shippingInfo.city}</p>
                          <p> {order.shippingInfo.state}</p>
                          <p> {order.shippingInfo.zip}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="orderStatusContainer">
            <form
              noValidate
              onSubmit={handleSubmit(async (data) => {
                if (data.status === "Status") {
                  return;
                }
                await dispatch(updateOrderAsync({ id: params.id, ...data }));
                dispatch(fetchOrderByIdAsync(params.id));
                reset();
              })}
            >
              <h1>Update Status</h1>
              <div className="form-section">
                <div className="form">
                  <div className="input">
                    <FaTruckFast />
                    <select
                      id="status"
                      {...register("status", {
                        required: "status is required",
                      })}
                    >
                      <option>Status</option>
                      {order && order.orderStatus === "Processing" && (
                        <option value={"Shipped"}>Shipped</option>
                      )}
                      {order && order.orderStatus === "Shipped" && (
                        <option value={"Delivered"}>Delivered</option>
                      )}
                    </select>
                  </div>
                </div>
                <button
                  disabled={order && order.orderStatus === "Delivered"}
                  className="create-btn"
                  type="submit"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderUpdate;
