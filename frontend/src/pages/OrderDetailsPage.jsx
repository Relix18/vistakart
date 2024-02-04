import React from "react";
import OrderDetails from "../Components/OrderDetails.jsx";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";

const OrderDetailsPage = () => {
  return (
    <>
      <Navbar />
      <OrderDetails />
      <Footer />
    </>
  );
};

export default OrderDetailsPage;
