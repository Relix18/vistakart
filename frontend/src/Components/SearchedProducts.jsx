import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  productAsync,
  productStatus,
  productsBrandAsync,
  productsCategoryAsync,
  selectAllProducts,
} from "../redux/product/productSlice";
import {
  addAsync,
  itemsByUserIdAsync,
  selectItems,
} from "../redux/cart/cartSlice";
import { selectUserInfo } from "../redux/user/userSlice";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import Pagination from "./Pagination";
import { FaStar } from "react-icons/fa";

const SearchedProducts = () => {
  const { search } = useParams();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { products, productCount, resultPerPage, filteredProductsCount } =
    useSelector(selectAllProducts);
  const status = useSelector(productStatus);
  const items = useSelector(selectItems);
  const user = useSelector(selectUserInfo);

  useEffect(() => {
    dispatch(productAsync({ search }));
  }, [search, dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(itemsByUserIdAsync());
    }
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(productsBrandAsync());
    dispatch(productsCategoryAsync());
  }, [dispatch]);

  const addToCartHandler = (item) => {
    if (user) {
      if (items.findIndex((i) => i.productId === item.id) < 0) {
        const newItem = { ...item, productId: item.id, qty: 1, user: user.id };
        delete newItem["id"];
        dispatch(addAsync(newItem));
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
      )}
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
  item,
  thumbnail,
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

export default SearchedProducts;
