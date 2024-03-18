import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const AdminPanel = () => {
  const [projectname, setProjectname] = useState('');
  const [address, setAddress] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState('');
  const [direct, setDirect] = useState(false);
  const [subcategory, setSubcategory] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [posts, setPosts] = useState([]);

  // useEffect(() => {
  //   // const fetchData = async () => {
  //   //   try {
  //   //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/createpost`);
  //   //     console.log(response);
  //   //     if (response.status === 200) {
  //   //       setPosts(response.data); // Assuming the response data is an array of posts
  //   //     }
  //   //   } catch (error) {
  //   //     console.error('Error fetching posts:', error);
  //   //   }
  //   // };

  //   // fetchData();
  // }, []);

  async function createNewPost(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.set('projectname', projectname);
    data.set('address', address);
    data.set('content', content);
    for (let i = 0; i < files.length; i++) {
      data.append('files', files[i]);
    }
    data.set('category', category);
    data.set('subcategory', subcategory);
    data.set('price', price);
    data.set('type', type);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/createpost`, data);
      if (response.status === 200) {
        setDirect(true);
        setProjectname('');
        setAddress('');
        setContent('');
        setFiles([]);
        setCategory('');
        setSubcategory('');
        setPrice('');
        setType('');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }

  return (
    <div className='container'>
      <h2 className='text-center'>Create Project</h2>
      <form onSubmit={createNewPost}>
        <input className='mt-3' type='text' placeholder='Enter Project Name' value={projectname} onChange={ev => setProjectname(ev.target.value)} /><br />
        <textarea className='mt-3' placeholder='Enter the Address' value={address} onChange={ev => setAddress(ev.target.value)}></textarea><br />

        <input className='mt-3' type='file' onChange={ev => setFiles([...ev.target.files])} accept='.webp' multiple /><br />
        <ReactQuill value={content} onChange={newValue => setContent(newValue)} /><br />
        <label className='mt-3'>Category</label><br />
        <select value={category} onChange={ev => setCategory(ev.target.value)} >
          <option>Select Option</option>
          <option>WIC</option>
          <option>Womeki Infra</option>
          <option>Womeki Tech</option>
          <option>Womeki holiday club</option>
        </select><br />
        <label className='mt-3'>Subcategory</label><br />
        <select className='mb-3' value={subcategory} onChange={ev => setSubcategory(ev.target.value)} >
          <option>Select Option</option>
          <option>Recent</option>
          <option>Upcoming</option>
          <option>Commercial</option>
          <option>Invest In</option>
          <option>Studio</option>
        </select><br />
        <label>Select Type</label><br />
        <select className='' value={type} onChange={ev => setType(ev.target.value)}>
          <option>select option</option>
          <option>Plot</option>
          <option>Residential</option>
          <option>Commercial</option>
          <option>villa</option>
          <option>Shop</option>
          <option>flat</option>
        </select><br />
        <label className='mt-3'>Select Price Option</label><br />
        <select value={price} onChange={ev => setPrice(ev.target.value)}>
          <option>select option</option>
          <option>Price on request</option>
        </select><br />
        <button className='mt-3'>Create Post</button>
      </form>
    </div>
  );
}

export default AdminPanel;
