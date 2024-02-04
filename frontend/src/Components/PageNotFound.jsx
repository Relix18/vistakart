import { Link } from "react-router-dom";
import "../styles/PageNotFound.scss";

const PageNotFound = () => {
  return (
    <div id="notfound">
      <h1>404</h1>
      <h3>Page Not Found</h3>
      <Link to={"/"}>Go Home</Link>
    </div>
  );
};

export default PageNotFound;
