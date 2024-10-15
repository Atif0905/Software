import React, { useState } from 'react'
import "./createuser.css"
import { Link } from 'react-router-dom'
import axios from 'axios'

const CreateUser = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType ] = useState("");
  const [AssgProject, setAssgProject] = useState("");

  const handleSubmit = (e) =>{
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/SubAdminRegister`,{
      fname,
      lname,
      email,
      password,
      AssgProject,
      userType,
    }, {
      headers:{
        "Content-Type": "application/json",
        Accept:"application/json",
        "Access-Control-Allow-Origin": "*" ,
      }
    })
    .then((response) =>{
      const data = response.data;
      console.log(data, "subAdminRegister");
      if(data.status === "ok"){
        alert("Work Done");
      }else{
        alert("Not Working")
      }
    })
    .catch((error) =>{
      console.error("Error" , error);
    })
  }
  return (
    <div className='create-usermain' >
      <form onSubmit={handleSubmit}>
       <input type='text' placeholder=' Name ' onChange={(e) => setFname(e.target.value)} />
       <input type='text' placeholder=' Last ' onChange={(e) => setLname(e.target.value)} />
       <input type='email' placeholder=' Email ' onChange={(e) => setEmail(e.target.value)} />
       <input type='password' placeholder=' Pass ' onChange={(e) => setPassword(e.target.value)} />
       <input type='text' placeholder=' Assg  ' onChange={(e) => setAssgProject(e.target.value)} />
       <input type='text' placeholder=' Type ' onChange={(e) => setUserType(e.target.value)} />
       <button type='submit' >Register</button>

       </form>



    </div>
  )
}

export default CreateUser
