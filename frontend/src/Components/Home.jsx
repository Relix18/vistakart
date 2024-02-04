import { useEffect } from "react";
import "../styles/Home.scss";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useDispatch, useSelector } from "react-redux";
import { bannerAsync, selectBanner } from "../redux/product/productSlice";
import ProductList from "./ProductList";

const Home = () => {
  const dispatch = useDispatch();
  const { banners } = useSelector(selectBanner);

  useEffect(() => {
    dispatch(bannerAsync());
  }, [dispatch]);

  return (
    <div id="home">
      <Carousel
        className="carousel"
        autoPlay={true}
        interval={2000}
        showArrows={false}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        swipeable={true}
      >
        {banners &&
          banners.map((i) => (
            <div key={i._id}>
              <img src={i.url} alt="banner" />
            </div>
          ))}
      </Carousel>

      <div>
        <ProductList />
      </div>
    </div>
  );
};

export default Home;
