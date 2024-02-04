import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "../styles/Contact.scss";
import { MdEmail, MdLocalPhone, MdLocationOn } from "react-icons/md";
import Footer from "./Footer.jsx";
import vector from "../assets/contact.png";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { clearError, contactUsAsync } from "../redux/user/userSlice";

const Contact = () => {
  const { register, handleSubmit } = useForm();
  const { error, success } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (success) {
      toast.success("Mail Sent Successfully");
      dispatch(clearError());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  });

  return (
    <div id="contact">
      <Navbar />

      <div className="contact-container">
        <form
          onSubmit={handleSubmit((data) => {
            dispatch(contactUsAsync(data));
          })}
        >
          <p className="p3">Contact Us</p>
          <div className="inputBox">
            <input
              type="text"
              id="name"
              name="name"
              {...register("name", {
                required: "name is required",
              })}
              required
            />
            <label htmlFor="name">Name*</label>
          </div>
          <div className="inputBox">
            <input
              type="email"
              id="email"
              name="email"
              {...register("email", {
                required: "email is required",
              })}
              required
            />
            <label htmlFor="email">Email*</label>
          </div>
          <div className="inputBox">
            <textarea
              id="message"
              name="message"
              {...register("message", {
                required: "message is required",
              })}
              required
            ></textarea>
            <label htmlFor="message">Message*</label>
          </div>
          <button type="submit">Send</button>
        </form>

        <div className="vector">
          <img src={vector} alt="vector" />
        </div>
      </div>

      <div className="footerContact">
        <div className="location">
          <MdLocationOn />
          <h3>Location</h3>
          <p>Gora Bazar, Raebareli</p>
        </div>
        <div className="email">
          <MdEmail />
          <h3>Email</h3>
          <p>relix049@gmail.com</p>
        </div>
        <div className="phone">
          <MdLocalPhone />
          <h3>Phone</h3>
          <p>7080866300</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
