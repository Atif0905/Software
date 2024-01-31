import React, { useEffect, useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from 'react-paginate';
import axios from 'axios'; // Import Axios
import { useRef } from "react";

export default function AdminHome({ userData }) {

  // Setting state
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(5);
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef();

  useEffect(() => {
    currentPage.current = 1;
    getPaginatedUsers();
  }, []);

  // Logout
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };

  // Deleting user
  const deleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}`)) {
      axios.post(`${process.env.REACT_APP_API_URL}/deleteUser`, { userid: id })
        .then(response => {
          alert(response.data.data);
          getPaginatedUsers();
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    }
  };

  // Pagination
  function handlePageClick(e) {
    currentPage.current = e.selected + 1;
    getPaginatedUsers();
  }

  function changeLimit() {
    currentPage.current = 1;
    getPaginatedUsers();
  }

  function getPaginatedUsers() {
    axios.get(`${process.env.REACT_APP_API_URL}/paginatedUsers?page=${currentPage.current}&limit=${limit}`)
      .then(response => {
        setPageCount(response.data.pageCount);
        setData(response.data.result);
      })
      .catch(error => {
        console.error('Error fetching paginated users:', error);
      });
  }

  return (
    <div className="auth-wrapper" style={{ height: "auto" }}>
      <div className="auth-inner" style={{ width: "auto" }}>
        <h3>Welcome Admin</h3>
        <table style={{ width: 500 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.map((i, index) => (
              <tr key={index}>
                <td>{i.fname}</td>
                <td>{i.email}</td>
                <td>{i.userType}</td>
                <td>
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => deleteUser(i._id, i.fname)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          marginPagesDisplayed={2}
          containerClassName="pagination justify-content-center"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          activeClassName="active"
          forcePage={currentPage.current - 1}
        />
        <input placeholder="Limit" value={limit} onChange={e => setLimit(e.target.value)} />
        <button onClick={changeLimit}>Set Limit</button>
        <button onClick={logOut} className="btn btn-primary">
          Log Out
        </button>
      </div>
    </div>
  );
}
