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
    <div className='main-content'>
      <div className='formback '>
      <h3 className="formhead">Assign Project</h3> 
      <form onSubmit={handleSubmit} className='p-2'>
        <div className='row'>
        <div className='col-6'>
        <input
          type='text'
          className="form-input-field"
          placeholder='First Name'
          onChange={(e) => setFname(e.target.value)}
          required
        />
        </div>
        <div className='col-6'>
        <input
          type='text'
          className="form-input-field"
          placeholder='Last Name'
          onChange={(e) => setLname(e.target.value)}
          required
        /></div>
        <div className='col-6'>
        <input
          type='email'
          className="form-input-field"
          placeholder='Email'
          onChange={(e) => setEmail(e.target.value)}
          required
        /></div>
        <div className='col-6'>
        <input
          type='password'
          className="form-input-field"
          placeholder='Password'
          onChange={(e) => setPassword(e.target.value)}
          required
        /></div>
        <div className='col-6'>
        <select
          value={assgProject}
          onChange={(e) => setAssgProject(e.target.value)}
          required 
          className="form-input-field"
        >
          <option value='' disabled>
            Select Project
          </option>
          {projects.map((project) => (
            <option key={project._id} value={project.name}>
              {project.name}
            </option>
          ))}
        </select></div>
        <div className='col-6'>
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          required 
          className="form-input-field"
        >
          <option value='' disabled>
            Select User Type
          </option>
          <option value='SubAdmin'>SubAdmin</option>
        </select>
        </div>
        <div className='center'><button className="addbutton " type='submit'>Register</button></div>
        </div>
      </form>
    </div>
    </div>
  );
};

export default CreateUser;
