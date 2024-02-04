import React, { useCallback, useEffect, useState } from "react";
import Sidebar, { SidebarMobile } from "./Sidebar";
import "../../styles/Dashboard.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import {
  adminProductAsync,
  selectAdminProducts,
} from "../../redux/product/productSlice";
import {
  fetchLoggedInUserAsync,
  getAllUserAsync,
  selectAllUsers,
} from "../../redux/user/userSlice";
import { selectUserInfo } from "../../redux/user/userSlice.js";
import { Link } from "react-router-dom";
import { allOrdersAsync, selectAllOrders } from "../../redux/order/orderSlice";
import { FaBars } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  Legend
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAdminProducts);
  const orders = useSelector(selectAllOrders);
  const users = useSelector(selectAllUsers);
  const [show, setShow] = useState(false);

  useEffect(() => {
    dispatch(adminProductAsync());
    dispatch(allOrdersAsync());
    dispatch(getAllUserAsync());
  }, []);

  let totalAmount = 0;

  orders &&
    orders.forEach((element) => {
      totalAmount += element.total;
    });

  let outOfScock = 0;
  let stock = 0;

  products &&
    products.forEach((element) => {
      if (element.stock === 0) {
        outOfScock += 1;
      } else {
        stock += 1;
      }
    });

  const lineData = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "Total Amount",
        backgroundColor: "rgba(75,192,192,0.4)",
        hoverBackgroundColor: "red",
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutData = {
    labels: ["Out of Stock", "In Stock"],
    datasets: [
      {
        backgroundColor: ["#f02828", "#2874f0"],
        hoverBackgroundColor: ["#ff0000", "#0062ff"],
        data: [outOfScock, stock],
      },
    ],
  };

  return (
    <div id="dashboard" className={show ? "lock-scrollbar" : ""}>
      <Sidebar />
      <div id="toggleBtn" onClick={() => setShow(!show)}>
        <FaBars />
      </div>
      <SidebarMobile isOpen={show} />
      <div className="dashboardContainer">
        <h2>Dashboard</h2>
        <div className="total">
          <p>Total Amount Collected</p>
          <p>₹{totalAmount}</p>
        </div>
        <div className="circles">
          <Link to="/admin/products">
            <div className="products circle">
              <p>Products</p>
              <p>{products && products.length}</p>
            </div>
          </Link>
          <Link to="/admin/orders">
            <div className="orders circle">
              <p>Orders</p>
              <p>{orders && orders.length}</p>
            </div>
          </Link>
          <Link to="/admin/users">
            <div className="users circle">
              <p>Users</p>
              <p>{users && users.length}</p>
            </div>
          </Link>
        </div>

        <div className="lineChart">
          <Line data={lineData} />
        </div>

        <div>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
