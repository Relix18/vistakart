import { useEffect, useState } from "react";
import "../styles/UserOrders.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo } from "../redux/user/userSlice";
import {
  fetchOrdersByUserAsync,
  orderStatus,
  selectOrders,
} from "../redux/order/orderSlice";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

const UserOrders = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);
  const orders = useSelector(selectOrders);
  const status = useSelector(orderStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchOrdersByUserAsync());
  }, [dispatch, user]);

  const lastPostIndex = currentPage * 5;
  const firstPostIndex = lastPostIndex - 5;

  const data = orders.slice(firstPostIndex, lastPostIndex);

  const detailHandler = (id) => {
    navigate(`/order/${id}`);
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
        <div id="Orders">
          <h1>My Orders</h1>
          <div className="order">
            <div className="orderId">
              <table>
                <thead>
                  <tr>
                    <th>OrderId</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>Item Qty</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                {orders &&
                  data.map((order, i) => (
                    <tbody key={i}>
                      <tr>
                        <td>
                          <div className="orderId">{order._id}</div>
                        </td>

                        <td>
                          <div className="image-div">
                            {order.items &&
                              order.items.map((item) => (
                                <img src={item.product.thumbnail.url} />
                              ))}
                          </div>
                        </td>

                        <td
                          className={
                            order.orderStatus === "Delivered"
                              ? "green"
                              : order.orderStatus === "Processing"
                              ? "red"
                              : "yellow"
                          }
                        >
                          {order.orderStatus}
                        </td>
                        <td>{order.totalItems}</td>
                        <td>₹{order.total}</td>
                        <td>
                          <button onClick={() => detailHandler(order._id)}>
                            View Details
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  ))}
              </table>
            </div>
          </div>
          <Pagination
            totalPosts={orders.length}
            setCurrentPage={setCurrentPage}
            postsPerPage={5}
            currentPage={currentPage}
          />
        </div>
      )}
    </>
  );
};

export default UserOrders;
