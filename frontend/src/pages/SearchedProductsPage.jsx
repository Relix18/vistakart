import SearchedProducts from "../Components/SearchedProducts";
import Navbar from "../Components/Navbar";
import "../styles/searchedProducts.scss";
import Footer from "../Components/Footer";

const SearchedProductsPage = () => {
  return (
    <div>
      <Navbar />
      <div id="searchedProducts">
        <SearchedProducts />
      </div>
      <Footer />
    </div>
  );
};

export default SearchedProductsPage;
