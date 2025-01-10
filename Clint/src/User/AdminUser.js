import React, { useEffect, useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from 'react-paginate';
import axios from 'axios'; 
import { useRef } from "react";
import './User.css'
const AdminUser = () => {
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef();  
  useEffect(() => {
    currentPage.current = 1;
    getPaginatedUsers();
  }, []);
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
    <div className=" back main-content" >
      <div className="formback1 "  > 
      <h3 className="formhead">Welcome Admin</h3>  
      <div className="p-3">
            <table >
              <thead className="">
              <tr>
              <th>Name</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Delete</th>
              </tr>
              </thead>
              <tbody>
              {data.map((i, index) => (
              <tr className='formtabletext' key={index}>
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
            </div>
            </div>
      </div>
  );
}

export default AdminUser;