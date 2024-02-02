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
    <div></div>
  );
}
