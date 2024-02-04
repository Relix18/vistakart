import { useEffect, useState } from "react";
import "../styles/ProductList.scss";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Pagination from "./Pagination.jsx";

import {
  productAsync,
  productsBrandAsync,
  productsCategoryAsync,
  productStatus,
  selectAllProducts,
  selectBrands,
  selectCategories,
} from "../redux/product/productSlice";
import {
  addAsync,
  itemsByUserIdAsync,
  selectItems,
} from "../redux/cart/cartSlice";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { selectUserInfo } from "../redux/user/userSlice.js";

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { products, productCount, resultPerPage, filteredProductsCount } =
    useSelector(selectAllProducts);
  const status = useSelector(productStatus);
  const items = useSelector(selectItems);
  const user = useSelector(selectUserInfo);
  const { brands } = useSelector(selectBrands);
  const { categories } = useSelector(selectCategories);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    dispatch(productAsync({ currentPage, filter }));
  }, [dispatch, currentPage, filter]);

  useEffect(() => {
    if (user) {
      dispatch(itemsByUserIdAsync(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(productsBrandAsync());
    dispatch(productsCategoryAsync());
  }, [dispatch]);

  const filters = [
    {
      id: "category",
      name: "Category",
      options: categories,
    },
    {
      id: "brand",
      name: "Brands",
      options: brands,
    },
  ];

  const handleFilter = (e, section, option) => {
    const newFilter = { ...filter };
    if (e.target.checked) {
      if (newFilter[section.id]) {
        newFilter[section.id].push(option.value);
      } else {
        newFilter[section.id] = [option.value];
      }
    } else {
      const index = newFilter[section.id].findIndex(
        (value) => value === option.value
      );
      newFilter[section.id].splice(index, 1);
    }
    setFilter(newFilter);
  };

  const addToCartHandler = async (item) => {
    if (user) {
      if (items.findIndex((i) => i.product._id === item._id) < 0) {
        const newItem = { productId: item._id, quantity: 1 };

        await dispatch(addAsync(newItem));
        dispatch(itemsByUserIdAsync(user._id));
        toast.success("Added To Cart");
      } else {
        toast.error("Item Already Added");
      }
    } else {
      toast.error("Please Login First");
    }
  };

  return (
    <>
      <div id="products">
        <div>
          <div id="filter">
            <h2>Filters</h2>
            {filters.map((section) => (
              <div className="filter option" key={section.id}>
                <p>{section.name}</p>
                {section.options &&
                  section.options.map((option, i) => (
                    <div key={i}>
                      <input
                        type="checkbox"
                        name={`${section.id}[]`}
                        value={option.value}
                        id={`filter-${section.id}-${i}`}
                        onChange={(e) => handleFilter(e, section, option)}
                      />

                      <label htmlFor={`filter-${section.id}-${i}`}>
                        {option.label}
                      </label>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

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
          <div>
            <div id="productList">
              {products && products.length === 0 && (
                <p className="noMatch">No Match Found</p>
              )}
              {products &&
                products.map((item) => (
                  <ProductCard
                    key={item._id}
                    brand={item.brand}
                    thumbnail={item.thumbnail.url}
                    title={item.name}
                    price={item.price}
                    handler={addToCartHandler}
                    item={item}
                    id={item._id}
                    rating={item.ratings}
                    category={item.category}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {resultPerPage < filteredProductsCount && (
        <Pagination
          totalPosts={productCount}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          postsPerPage={resultPerPage}
        />
      )}
    </>
  );
};

const ProductCard = ({
  id,
  rating,
  thumbnail,
  item,
  title,
  price,
  handler,
  category,
}) => {
  return (
    <div className="card">
      <Link to={`/product/${id}`} className="productLink">
        <div className="img-container">
          <img src={thumbnail} alt="product" />
        </div>
        <h5>
          {title && title.length >= 16 ? title.substring(0, 17) + "..." : title}
        </h5>
        <h5 className="cat">{category}</h5>
        <h3>₹{price}</h3>
        <h4>
          <FaStar />
          {Number.isInteger(rating) ? rating : rating.toFixed(1)}
        </h4>
      </Link>
      <button onClick={() => handler(item)}>ADD TO CART</button>
    </div>
  );
};

export default ProductList;
