import { useEffect } from "react";
import "../styles/Pagination.scss";

const Pagination = ({
  totalPosts,
  setCurrentPage,
  currentPage,
  postsPerPage,
}) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  let pages = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i);
  }

  const isPrev = currentPage > 1;
  const isNext = currentPage < pages.length;

  return (
    <div id="Pagination">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={!isPrev}
        className="btn"
      >
        Prev
      </button>

      <p>
        {currentPage} of {pages.length}
      </p>

      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={!isNext}
        className="btn"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
