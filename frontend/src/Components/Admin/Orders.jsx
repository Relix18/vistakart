import React, { useEffect, useState } from "react";
import Sidebar, { SidebarMobile } from "./Sidebar";
import "../../styles/Orders.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  allOrdersAsync,
  deleteOrderAsync,
  selectAllOrders,
} from "../../redux/order/orderSlice";
import { usePagination, useSortBy, useTable } from "react-table";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import {
  MdDelete,
  MdEdit,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
} from "react-icons/md";
import { FaArrowDown, FaArrowUp, FaBars } from "react-icons/fa";

const Orders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [show, setShow] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const columns = React.useMemo(
    () => [
      {
        Header: "OrderId",
        accessor: "_id",
      },

      {
        Header: "Name",
        accessor: "shippingInfo.name",
      },
      {
        Header: "Status",
        accessor: "orderStatus",
        Cell: ({ value }) => (
          <span className={`orderStatus ${value.toLowerCase()}`}>{value}</span>
        ),
      },
      {
        Header: "Item Qty",
        accessor: "totalItems",
      },
      {
        Header: "Amount",
        accessor: "total",
        Cell: ({ value }) => `₹${value}`,
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <>
            <Link to={`/admin/order/${row.original._id}`}>
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
    dispatch(allOrdersAsync());
  }, [dispatch]);

  const handleDeleteConfirmation = (productId) => {
    setSelectedOrderId(productId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (selectedOrderId) {
      await dispatch(deleteOrderAsync(selectedOrderId));
      dispatch(allOrdersAsync());
      setDeleteConfirmationOpen(false);
      setSelectedOrderId(null);
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
      data: orders,
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
      {orders && (
        <div id="orders" className={show ? "lock-scrollbar" : ""}>
          <Sidebar />
          <div id="toggleBtn" onClick={() => setShow(!show)}>
            <FaBars />
          </div>
          <SidebarMobile isOpen={show} />

          <div className="orderContainer">
            <div id="Orders">
              <h1>All Orders</h1>
              <div className="order">
                <div className="orderId">
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
                                    <MdKeyboardArrowDown />
                                  ) : (
                                    <MdKeyboardArrowUp />
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

export default Orders;
