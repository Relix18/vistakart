import React, { useEffect, useState } from "react";
import Sidebar, { SidebarMobile } from "./Sidebar";
import "../../styles/EditProduct.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  adminProductAsync,
  productByIdAsync,
  productStatus,
  productsBrandAsync,
  productsCategoryAsync,
  selectBrands,
  selectCategories,
  selectProductById,
  updateProductAsync,
} from "../../redux/product/productSlice";
import { useForm, Controller } from "react-hook-form";
import {
  MdApartment,
  MdArticle,
  MdCategory,
  MdDataUsage,
  MdDiscount,
  MdFontDownload,
  MdOutlinePriceCheck,
} from "react-icons/md";
import { useParams } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";

const EditProduct = () => {
  const [previewImage, setPreviewImage] = useState([]);
  const [previewThumb, setPreviewThumb] = useState(null);
  const [show, setShow] = useState(false);
  const { brands } = useSelector(selectBrands);
  const { categories } = useSelector(selectCategories);
  const dispatch = useDispatch();
  const params = useParams();
  const { product } = useSelector(selectProductById);
  const status = useSelector(productStatus);
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(productByIdAsync(params.id));
    dispatch(productsCategoryAsync());
    dispatch(productsBrandAsync());
  }, [dispatch]);

  useEffect(() => {
    setValue("name", product && product.name);
    setValue("price", product && product.price);
    setValue("description", product && product.description);
    setValue("discountPercentage", product && product.discountPercentage);
    setValue("stock", product && product.stock);
    setValue("brand", product && product.brand);
    setValue("category", product && product.category);
  }, [product, setValue]);

  useEffect(() => {
    const value = [];
    previewImage &&
      previewImage.forEach((item) => {
        value.push(item);
      });
    setValue("images", value);
  }, [previewImage, setValue]);

  const handleThumb = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewThumb(reader.result);
        setValue("thumbnail", reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setPreviewThumb(null);
    }
  };
  const handleFile = (e) => {
    const files = Array.from(e.target.files);

    setPreviewImage([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setPreviewImage((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <div id="editProduct" className={show ? "lock-scrollbar" : ""}>
      <Sidebar />
      <div id="toggleBtn" onClick={() => setShow(!show)}>
        <FaBars />
      </div>
      <SidebarMobile isOpen={show} />

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
        <div className="editContainer">
          <form
            noValidate
            onSubmit={handleSubmit(async (data) => {
              await dispatch(
                updateProductAsync({ product: data, id: params.id })
              );
              dispatch(adminProductAsync());
              reset();
              setPreviewImage([]);
              setPreviewThumb(null);
            })}
          >
            <h1>Edit Product</h1>
            <div className="form-section">
              <div className="form">
                <div className="input">
                  <MdFontDownload />
                  <input
                    type="text"
                    id="name"
                    placeholder="Product Name"
                    {...register("name", {
                      required: "name is required",
                    })}
                  />
                </div>

                <div className="input">
                  <MdArticle />
                  <textarea
                    type="text"
                    id="description"
                    placeholder="Description"
                    {...register("description", {
                      required: "description is required",
                    })}
                  />
                </div>

                <div className="input">
                  <MdCategory />
                  <select
                    id="category"
                    {...register("category", {
                      required: "category is required",
                    })}
                  >
                    <option value="category">Category</option>
                    {categories &&
                      categories.map((category) => (
                        <option value={category.value}>{category.label}</option>
                      ))}
                  </select>
                </div>
                <div className="input">
                  <MdApartment />
                  <select
                    id="brand"
                    {...register("brand", {
                      required: "brand is required",
                    })}
                  >
                    <option value="brand">Brand</option>
                    {brands &&
                      brands.map((brand) => (
                        <option value={brand.value}>{brand.label}</option>
                      ))}
                  </select>
                </div>

                <div className="input sec-1">
                  <MdOutlinePriceCheck />
                  <input
                    id="price"
                    type="number"
                    placeholder="Price"
                    {...register("price", {
                      required: "price is required",
                    })}
                  />
                </div>

                <div className="input">
                  <MdDiscount />
                  <input
                    type="number"
                    id="discountPercentage"
                    placeholder="Discount"
                    {...register("discountPercentage", {
                      required: "discount is required",
                    })}
                  />
                </div>
                <div className="input">
                  <MdDataUsage />
                  <input
                    type="number"
                    id="stock"
                    placeholder="Stock"
                    {...register("stock", {
                      required: "stock is required",
                    })}
                  />
                </div>

                <div className="main-col">
                  <div className="select">
                    <Controller
                      control={control}
                      name="thumbnail"
                      rules={{ required: "File is required" }}
                      render={({ field }) => (
                        <div className="file">
                          <input
                            id="file"
                            accept="image/*"
                            type="file"
                            name="thumbnail"
                            required
                            className="file-input thumb"
                            onChange={(e) => {
                              field.onChange(e);
                              handleThumb(e);
                            }}
                          />
                          {errors.thumbnail && (
                            <p className="error">{errors.thumbnail.message}</p>
                          )}

                          <div className="preview">
                            {previewThumb && <img src={previewThumb} />}
                          </div>
                        </div>
                      )}
                    />
                  </div>
                  <div className="select">
                    <Controller
                      control={control}
                      name="images"
                      rules={{ required: "File is required" }}
                      render={({ field }) => (
                        <div className="file">
                          <input
                            id="file"
                            accept="image/*"
                            type="file"
                            name="images"
                            className="file-input"
                            multiple
                            required
                            onChange={(e) => {
                              field.onChange(e);
                              handleFile(e);
                            }}
                          />
                          {errors.images && (
                            <p className="error">{errors.images.message}</p>
                          )}
                          <div className="preview">
                            {previewImage &&
                              previewImage.map((image, index) => (
                                <img key={index} src={image} />
                              ))}
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
              <button className="create-btn" type="submit">
                Edit Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditProduct;
