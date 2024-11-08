import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChannelList = () => {
    const [channels, setChannels] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/cp`);
            setChannels(response.data); 
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        fetchData();
      }, []);
    
  return (
    <div className='back main-content'>
        <div className='formback1 table-container'>
        <h4 className='formhead'>Channel List</h4>
        <div className='p-3'>
        <div className="formback1">
            <table>
            <thead className="formtablehead1">
            <tr>
            <th>S.No.</th>
                <th>ID</th>
                <th>Name</th>
                <th>Assign</th>
                </tr>
              </thead>
              <tbody>
                {channels.map((channel, index) => (
                <tr className='formtabletext' key={index}>
                     <td>{index + 1}</td>
                    <td>{channel.id}</td> 
                    <td>{channel.name}</td>
                    <td>{channel.assign}</td>
                    </tr>
               ))}
                   </tbody>
        </table>
          </div>
          </div>
          </div>
    </div>
  )
}

export default ChannelList