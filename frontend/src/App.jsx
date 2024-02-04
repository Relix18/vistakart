import { Toaster } from "react-hot-toast";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/auth/Login.jsx";
import Signup from "./Components/auth/Signup.jsx";
import ForgetPassword from "./Components/auth/ForgetPassword.jsx";
import Checkout from "./Components/Checkout.jsx";
import Protected from "./Components/auth/Protected.jsx";
import OrderSuccess from "./Components/OrderSuccess.jsx";
import HomePage from "./pages/HomePage.jsx";
import CartPage from "./pages/CartPage.jsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import UserOrdersPage from "./pages/UserOrdersPage.jsx";
import PageNotFound from "./Components/PageNotFound.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import Logout from "./Components/auth/Logout.jsx";
import SearchedProductsPage from "./pages/SearchedProductsPage.jsx";
import { useEffect } from "react";
import {
  fetchLoggedInUserAsync,
  selectUserInfo,
} from "./redux/user/userSlice.js";
import OrderDetailsPage from "./pages/OrderDetailsPage.jsx";
import ProtectedAdmin from "./Components/auth/ProtectedAdmin.jsx";
import Dashboard from "./Components/Admin/Dashboard.jsx";
import ProductList from "./Components/Admin/ProductList.jsx";
import Create from "./Components/Admin/Create.jsx";
import Category from "./Components/Admin/Category.jsx";
import Brand from "./Components/Admin/Brand.jsx";
import Banner from "./Components/Admin/Banner.jsx";
import AddBanner from "./Components/Admin/AddBanner.jsx";
import EditProduct from "./Components/Admin/EditProduct.jsx";
import Orders from "./Components/Admin/Orders.jsx";
import OrderUpdate from "./Components/Admin/OrderUpdate.jsx";
import UserList from "./Components/Admin/UserList.jsx";
import UserRole from "./Components/Admin/UserRole.jsx";
import Reviews from "./Components/Admin/Reviews.jsx";
import Contact from "./Components/Contact.jsx";
import ChangePassword from "./Components/auth/ChangePassword.jsx";
import ResetPassword from "./Components/auth/ResetPassword.jsx";
import { useDispatch, useSelector } from "react-redux";
import { itemsByUserIdAsync } from "./redux/cart/cartSlice.js";

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);
  const { checked } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchLoggedInUserAsync());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(itemsByUserIdAsync());
    }
  }, [dispatch, user]);

  return (
    <>
      {checked && (
        <Router>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/product/:id" element={<ProductDetailsPage />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/logout" element={<Logout />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/contactus" element={<Contact />} />
            <Route exact path="/forget-password" element={<ForgetPassword />} />
            <Route
              exact
              path="/password/reset/:token"
              element={<ResetPassword />}
            />
            <Route
              exact
              path="/user/change-password"
              element={
                <Protected>
                  <ChangePassword />
                </Protected>
              }
            />
            <Route
              exact
              path="/cart"
              element={
                <Protected>
                  <CartPage />
                </Protected>
              }
            />
            <Route
              exact
              path="/checkout"
              element={
                <Protected>
                  <Checkout />
                </Protected>
              }
            />
            <Route path="/search/:search" element={<SearchedProductsPage />} />
            <Route
              exact
              path="/orders"
              element={
                <Protected>
                  <UserOrdersPage />
                </Protected>
              }
            />
            <Route
              exact
              path="/order/:id"
              element={
                <Protected>
                  <OrderDetailsPage />
                </Protected>
              }
            />
            <Route
              exact
              path="/profile"
              element={
                <Protected>
                  <UserProfilePage />
                </Protected>
              }
            />
            <Route
              exact
              path="/admin/dashboard"
              element={
                <ProtectedAdmin>
                  <Dashboard />
                </ProtectedAdmin>
              }
            />
            <Route
              exact
              path="/admin/products"
              element={
                <ProtectedAdmin>
                  <ProductList />
                </ProtectedAdmin>
              }
            />
            <Route exact path="/admin/product/new" element={<Create />} />
            <Route
              exact
              path="/admin/product/new/category"
              element={
                <ProtectedAdmin>
                  <Category />
                </ProtectedAdmin>
              }
            />
            <Route
              exact
              path="/admin/product/new/brand"
              element={
                <ProtectedAdmin>
                  <Brand />
                </ProtectedAdmin>
              }
            />
            <Route
              exact
              path="/admin/banners"
              element={
                <ProtectedAdmin>
                  <Banner />
                </ProtectedAdmin>
              }
            />
            <Route
              exact
              path="/admin/banner/new"
              element={
                <ProtectedAdmin>
                  <AddBanner />
                </ProtectedAdmin>
              }
            />
            <Route
              exact
              path="/product/edit/:id"
              element={
                <ProtectedAdmin>
                  <EditProduct />
                </ProtectedAdmin>
              }
            />
            <Route
              exact
              path="/admin/orders"
              element={
                <ProtectedAdmin>
                  <Orders />
                </ProtectedAdmin>
              }
            />
            <Route
              exact
              path="/admin/order/:id"
              element={
                <ProtectedAdmin>
                  <OrderUpdate />
                </ProtectedAdmin>
              }
            />
            <Route
              exact
              path="/admin/users"
              element={
                <ProtectedAdmin>
                  <UserList />
                </ProtectedAdmin>
              }
            />
            <Route
              exact
              path="/admin/user/:id"
              element={
                <ProtectedAdmin>
                  <UserRole />
                </ProtectedAdmin>
              }
            />
            <Route
              exact
              path="/admin/reviews"
              element={
                <ProtectedAdmin>
                  <Reviews />
                </ProtectedAdmin>
              }
            />
            <Route exact path="/order-success/:id" element={<OrderSuccess />} />
            <Route exact path="*" element={<PageNotFound />} />
          </Routes>
          <Toaster />
        </Router>
      )}
    </>
  );
}

export default App;
