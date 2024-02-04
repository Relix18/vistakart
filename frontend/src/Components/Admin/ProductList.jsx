import React, { useEffect, useState } from "react";
import Sidebar, { SidebarMobile } from "./Sidebar";
import "../../styles/ProductListAdmin.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  adminProductAsync,
  deleteProductAsync,
  selectAdminProducts,
} from "../../redux/product/productSlice";
import {
  fetchLoggedInUserAsync,
  selectUserInfo,
} from "../../redux/user/userSlice";
import "../../styles/Pagination.scss";
import {
  MdDelete,
  MdEdit,
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
} from "react-icons/md";
import { useTable, useSortBy, usePagination } from "react-table";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { FaBars } from "react-icons/fa";

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAdminProducts);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [show, setShow] = useState(false);

  const columns = React.useMemo(
    () => [
      {
        Header: "ProductId",
        accessor: "_id",
      },
      {
        Header: "Item",
        accessor: "thumbnail.url",
        Cell: ({ value }) => <img src={value} alt="Product" width="50" />,
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Stock",
        accessor: "stock",
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => `₹${value}`,
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <>
            <Link to={`/product/edit/${row.original._id}`}>
              <MdEdit />
            </Link>
            <MdDelete
              onClick={() => handleDeleteConfirmation(row.original._id)}
            />
          </>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    dispatch(adminProductAsync());
  }, [dispatch]);

  const handleDeleteConfirmation = (productId) => {
    setSelectedProductId(productId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (selectedProductId) {
      await dispatch(deleteProductAsync(selectedProductId));
      dispatch(adminProductAsync());
      setDeleteConfirmationOpen(false);
      setSelectedProductId(null);
    }
  };

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
      data: products,
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
            width: "60%",
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
        <p>Are you sure you want to delete this product?</p>
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
      {products && (
        <div id="productListAdmin" className={show ? "lock-scrollbar" : ""}>
          <Sidebar />
          <div id="toggleBtn" onClick={() => setShow(!show)}>
            <FaBars />
          </div>
          <SidebarMobile isOpen={show} />
          <div className="productContainer">
            <div id="ProductList">
              <h1>All Products</h1>
              <div className="product">
                <div className="productId">
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
                </div>
              </div>
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductList;
