import React, { useEffect, useState } from "react";
import Sidebar, { SidebarMobile } from "./Sidebar";
import "../../styles/UserList.scss";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import {
  deleteUserAsync,
  getAllUserAsync,
  selectAllUsers,
} from "../../redux/user/userSlice";
import {
  MdDelete,
  MdEdit,
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
} from "react-icons/md";
import { usePagination, useSortBy, useTable } from "react-table";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [show, setShow] = useState(false);

  const columns = React.useMemo(
    () => [
      {
        Header: "UserId",
        accessor: "_id",
      },

      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Role",
        accessor: "role",
      },

      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <>
            <Link to={`/admin/user/${row.original._id}`}>
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
    dispatch(getAllUserAsync());
  }, [dispatch]);

  const handleDeleteConfirmation = (userId) => {
    setSelectedUserId(userId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (selectedUserId) {
      await dispatch(deleteUserAsync(selectedUserId));
      dispatch(getAllUserAsync());
      setDeleteConfirmationOpen(false);
      setSelectedUserId(null);
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
      data: users,
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
        <p>Are you sure you want to delete this user?</p>
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
      {users && (
        <div id="userList" className={show ? "lock-scrollbar" : ""}>
          <Sidebar />
          <div id="toggleBtn" onClick={() => setShow(!show)}>
            <FaBars />
          </div>
          <SidebarMobile isOpen={show} />
          <div className="userListContainer">
            <div id="Users">
              <h1>All Users</h1>
              <div className="user">
                <div className="userId">
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

export default UserList;
