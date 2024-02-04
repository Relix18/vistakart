import { useDispatch, useSelector } from "react-redux";
import "../styles/UserProfile.scss";
import {
  addUserAddressAsync,
  deleteUserAddressAsync,
  fetchLoggedInUserAsync,
  fetchUserAddressAsync,
  selectUserAddress,
  selectUserInfo,
  updateUserAddressAsync,
  updateUserAsync,
  userStatus,
} from "../redux/user/userSlice";
import { useForm, Controller } from "react-hook-form";
import { State } from "country-state-city";
import { useEffect, useRef, useState } from "react";
import { greeting, index } from "./utils/common";
import { Rings, ThreeDots } from "react-loader-spinner";
import Modal from "react-modal";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const dispatch = useDispatch();

  const divRef = useRef();
  const user = useSelector(selectUserInfo);
  const addresses = useSelector(selectUserAddress);
  const status = useSelector(userStatus);
  const states = State.getStatesOfCountry("IN");
  const [selectedEditIndex, setSelectedEditIndex] = useState(-1);
  const [addNew, setAddNew] = useState(false);
  const [previewImage, setPreviewImage] = useState("/logo512.png");
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    dispatch(fetchLoggedInUserAsync());
    dispatch(fetchUserAddressAsync());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const handleEdit = async (address, id) => {
    const newAddress = {
      address,
      id,
    };
    await dispatch(updateUserAddressAsync(newAddress));
    dispatch(fetchUserAddressAsync());
    setSelectedEditIndex(-1);
  };

  useEffect(() => {
    document.addEventListener("mousedown", userHandle);
  }, []);

  const userHandle = (e) => {
    if (divRef.current && !divRef.current.contains(e.target)) {
      setEdit(false);
    }
  };

  const handleEditForm = (index) => {
    setSelectedEditIndex(index);
    const address = addresses[index];
    setValue("name", address.address.name);
    setValue("email", address.address.email);
    setValue("phone", address.address.phone);
    setValue("street", address.address.street);
    setValue("city", address.address.city);
    setValue("state", address.address.state);
    setValue("zip", address.address.zip);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteUserAddressAsync(id));
    dispatch(fetchUserAddressAsync());
  };

  const handleAddButton = () => {
    setAddNew(!addNew);
    setSelectedEditIndex(-1);
    setAddNew(true);
    setValue("name", "");
    setValue("email", "");
    setValue("phone", "");
    setValue("street", "");
    setValue("city", "");
    setValue("state", "");
    setValue("zip", "");
  };

  const handleAdd = async (data) => {
    await dispatch(addUserAddressAsync(data));
    dispatch(fetchUserAddressAsync());
    reset();
    setAddNew(false);
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setValue("avatar", reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleNameEdit = () => {
    setEdit(true);
    setValue("name", user.name);
    setValue("email", user.email);
    setPreviewImage(user.avatar.url);
  };

  const handleEditUser = async (data) => {
    await dispatch(updateUserAsync(data));
    dispatch(fetchLoggedInUserAsync());
    setEdit(false);
  };

  return (
    <>
      <Modal
        isOpen={edit}
        onRequestClose={() => setEdit(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "460px",
            height: "300px",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "500",
          },
        }}
      >
        <form
          noValidate
          ref={divRef}
          className="edit-user"
          onSubmit={handleSubmit((data) => handleEditUser(data))}
        >
          <div className="edit-form">
            <h1>Update Profile</h1>

            <input
              id="name"
              {...register("name", {
                required: "Name is required",
              })}
              type="text"
            />
            <input
              id="email"
              {...register("email", {
                required: "Email is required",
              })}
              type="email"
            />
            <Controller
              control={control}
              name="file-area"
              render={({ field }) => (
                <div className="file">
                  <img src={previewImage} alt="avatar" />
                  <input
                    id="file"
                    accept="image/*"
                    type="file"
                    name="avatar"
                    className="file-input"
                    onChange={(e) => {
                      field.onChange(e);
                      handleAvatar(e);
                    }}
                  />
                </div>
              )}
            />
            <div className="btns">
              <button className="cancel" onClick={() => setEdit(false)}>
                Cancel
              </button>
              <button className="save" type="submit">
                Update
              </button>
            </div>
          </div>
        </form>
      </Modal>
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
        <div id="Profile">
          <h1>My Profile</h1>
          {user && (
            <div className="user">
              <h2>
                {greeting[index]}, <span>{user.name}</span>
              </h2>
              <div className="userId">
                <div className="userDetails">
                  <div className="userData">
                    <img src={user.avatar && user.avatar.url} alt={user.name} />
                    <div className="userInfo">
                      <h1>Name</h1>
                      <p className="email">{user.name}</p>
                      <h1>Email</h1>
                      <p className="email">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="buttons">
                  {!edit && (
                    <button className="edit" onClick={() => handleNameEdit()}>
                      Edit Profile
                    </button>
                  )}
                  <Link to={"/user/change-password"}>
                    <button className="password-btn">Change Password</button>
                  </Link>

                  <button onClick={() => handleAddButton()}>
                    Add New Address
                  </button>
                </div>
                {addNew ? (
                  <form
                    noValidate
                    onSubmit={handleSubmit((data) => {
                      handleAdd(data);
                      reset();
                    })}
                  >
                    <div className="form-section">
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
                      <div className="btns">
                        <button
                          className="cancel-btn"
                          onClick={() => setAddNew(false)}
                        >
                          Cancel
                        </button>
                        <button className="add-btn" type="submit">
                          Add Address
                        </button>
                      </div>
                    </div>
                  </form>
                ) : null}
              </div>
              <h3>Addresses</h3>
              {addresses &&
                addresses.map((i, index) => (
                  <div key={index}>
                    {selectedEditIndex === index ? (
                      <form
                        noValidate
                        onSubmit={handleSubmit((data) => {
                          handleEdit(data, i._id);
                          reset();
                        })}
                      >
                        <div className="form-section">
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
                          <div className="btns">
                            <button
                              className="cancel-btn"
                              type="submit"
                              onClick={() => setSelectedEditIndex(-1)}
                            >
                              Cancel
                            </button>
                            <button className="add-btn" type="submit">
                              Edit Address
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : null}
                    <div className="address">
                      <div className="row">
                        <div className="col-1">
                          <p className="name-p">{i.address.name}</p>
                          <p className="address-p">{i.address.street}</p>
                          <p className="phone-p">Phone: {i.address.phone}</p>
                        </div>
                        <div className="col-2">
                          <p className="city-p">{i.address.city}</p>
                          <p className="state-p">{i.address.state}</p>
                          <p className="pin-p">{i.address.zip}</p>
                        </div>
                        <div className="col-3">
                          <button onClick={() => handleEditForm(index)}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(i._id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UserProfile;
