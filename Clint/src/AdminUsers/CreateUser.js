import React, { useState, useEffect } from 'react';
import './createuser.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CreateUser = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [assgProject, setAssgProject] = useState('');
  const [projects, setProjects] = useState([]); // Store all projects

  // Fetch all projects on component mount
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/getAllProjects`)
      .then((response) => {
        console.log(response.data); // Log the response
        if (Array.isArray(response.data.data)) {
          setProjects(response.data.data); // Set projects from response.data.data
        } else {
          console.error('Expected an array, but got:', response.data.data);
        }
      })
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/SubAdminRegister`,
        {
          fname,
          lname,
          email,
          password,
          AssgProject: assgProject, // Use the selected project
          userType,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
      .then((response) => {
        const data = response.data;
        console.log(data, 'subAdminRegister');
        if (data.status === 'ok') {
          alert('Work Done');
        } else {
          alert('Not Working');
        }
      })
      .catch((error) => {
        console.error('Error', error);
      });
  };

  return (
    <div className='create-usermain'>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Name'
          onChange={(e) => setFname(e.target.value)}
          required
        />
        <input
          type='text'
          placeholder='Last'
          onChange={(e) => setLname(e.target.value)}
          required
        />
        <input
          type='email'
          placeholder='Email'
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Pass'
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Dropdown for Assigned Project */}
        <select
          value={assgProject}
          onChange={(e) => setAssgProject(e.target.value)}
          required // Make this field required
        >
          <option value='' disabled>
            Select Project
          </option>
          {projects.map((project) => (
            <option key={project._id} value={project.name}>
              {project.name}
            </option>
          ))}
        </select>

        {/* Dropdown for User Type */}
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          required // Make this field required
        >
          <option value='' disabled>
            Select User Type
          </option>
          <option value='SubAdmin'>SubAdmin</option>
          {/* Add more user types as needed */}
        </select>

        <button type='submit'>Register</button>
      </form>
    </div>
  );
};

export default CreateUser;
