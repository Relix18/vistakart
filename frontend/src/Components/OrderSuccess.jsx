import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { resetOrder, selectOrderPlaced } from "../redux/order/orderSlice";
import { resetCartAsync } from "../redux/cart/cartSlice";
import img from "../assets/successful.png";
import "../styles/OrderSuccess.scss";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch(resetCartAsync());
    dispatch(resetOrder());
  }, [dispatch]);

  return (
    <>
      {!params.id && <Navigate to="/" replace={true} />}
      <div id="order">
        <div className="main">
          <img src={img} />
          <p className="p1">Order Successful</p>
          <p className="p2">{params.id}</p>
          <p className="p3">You can check your order in My Orders</p>
          <Link className="btn" to="/orders">
            View Orders
          </Link>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
