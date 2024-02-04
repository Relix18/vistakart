import React, { useEffect } from "react";
import "../styles/OrderDetails.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderByIdAsync,
  orderStatus,
  selectOrderById,
} from "../redux/order/orderSlice";
import { useParams } from "react-router-dom";
import { Rings } from "react-loader-spinner";

const OrderDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const order = useSelector(selectOrderById);
  const status = useSelector(orderStatus);

  useEffect(() => {
    dispatch(fetchOrderByIdAsync(params.id));
  }, []);

  return (
    <>
      {status === "loading" ? (
        <div id="loader">
          <Rings
            height="180"
            width="180"
            color="blue"
            radius="6"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="rings-loading"
          />
        </div>
      ) : (
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
                          <p className="productBrand">{item.product.brand}</p>
                          <p className="productQty">Qty : {item.quantity}</p>
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
                    {order.paymentMethod === "online" && (
                      <p
                        className={
                          order.paymentStatus === "Paid"
                            ? `green-clr`
                            : `red-clr`
                        }
                      >
                        Payment Status: {order.paymentStatus}
                      </p>
                    )}

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
      )}
    </>
  );
};

export default OrderDetails;
