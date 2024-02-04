import React, { useEffect, useState } from "react";
import Sidebar, { SidebarMobile } from "./Sidebar";
import "../../styles/Reviews.scss";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete, MdStar } from "react-icons/md";
import { usePagination, useSortBy, useTable } from "react-table";
import {
  deleteReviewAsync,
  getAllReviewAsync,
  selectReviews,
} from "../../redux/product/productSlice";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const Reviews = () => {
  const [productId, setProductId] = useState("");
  const reviews = useSelector(selectReviews);
  const dispatch = useDispatch();
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [show, setShow] = useState(false);

  const handleDeleteConfirmation = (reviewId) => {
    setSelectedReviewId(reviewId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (selectedReviewId) {
      await dispatch(deleteReviewAsync({ selectedReviewId, productId }));
      dispatch(getAllReviewAsync(productId));
      setDeleteConfirmationOpen(false);
      setSelectedReviewId(null);
    }
  };

  useEffect(() => {
    if (productId.length === 24) {
      dispatch(getAllReviewAsync(productId));
    }
  }, [dispatch, productId]);

  const productReviewsSubmitHandler = (e, productId) => {
    e.preventDefault();
    dispatch(getAllReviewAsync(productId));
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "ReviewId",
        accessor: "_id",
      },

      {
        Header: "User",
        accessor: "name",
      },
      {
        Header: () => <p className="comment">Comment</p>,
        accessor: "comment",
        Cell: ({ value }) => <p className="comment">{value}</p>,
      },

      {
        Header: "Rating",
        accessor: "rating",
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <>
            <MdDelete
              onClick={() => handleDeleteConfirmation(row.original._id)}
            />
          </>
        ),
      },
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    previousPage,
    nextPage,
    canNextPage,
    canPreviousPage,
    state: { pageIndex },
    pageCount,
    gotoPage,
    prepareRow,
  } = useTable(
    {
      columns,
      data: reviews && reviews,
    },
    useSortBy,
    usePagination
  );

  return (
    <>
      <Modal
        isOpen={isDeleteConfirmationOpen}
        onRequestClose={() => setDeleteConfirmationOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "300px",
            height: "150px",
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
        <p>Are you sure you want to delete this order?</p>
        <div className="modal-buttons-container">
          <button
            className={`modal-button delete-button`}
            onClick={() => handleDeleteConfirmed()}
          >
            Yes
          </button>
          <button
            className="modal-button"
            onClick={() => setDeleteConfirmationOpen(false)}
          >
            No
          </button>
        </div>
      </Modal>
      <div id="reviews" className={show ? "lock-scrollbar" : ""}>
        <Sidebar />
        <div id="toggleBtn" onClick={() => setShow(!show)}>
          <FaBars />
        </div>
        <SidebarMobile isOpen={show} />
        <div className="reviewContainer">
          <form
            className="productReviewsForm"
            onSubmit={(e) => productReviewsSubmitHandler(e)}
          >
            <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

            <div className="input">
              <MdStar />
              <input
                type="text"
                placeholder="Product Id"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <button className="create-btn" type="submit">
              Search
            </button>
          </form>

          {reviews && reviews.length === 0 ? (
            <h1>No reviews found</h1>
          ) : (
            <>
              <table {...getTableProps()}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          {column.render("Header")}
                          {column.isSorted && (
                            <span>
                              {column.isSortedDesc ? (
                                <MdOutlineArrowDropDown />
                              ) : (
                                <MdOutlineArrowDropUp />
                              )}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="Pagination">
                <button disabled={!canPreviousPage} onClick={() => gotoPage(0)}>
                  First
                </button>
                <button disabled={!canPreviousPage} onClick={previousPage}>
                  Prev
                </button>
                <p>
                  {pageIndex + 1} of {pageCount}
                </p>
                <button disabled={!canNextPage} onClick={nextPage}>
                  Next
                </button>
                <button
                  disabled={!canNextPage}
                  onClick={() => gotoPage(pageCount - 1)}
                >
                  Last
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Reviews;
