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
    <div className='formback mt-5'>
      <h2 className='formhead'>Create Project</h2>
      <div className='p-3'>
      <form onSubmit={createNewPost}>
        <input  className="form-input-field" type='text'   placeholder='Enter Project Name' value={projectname} onChange={ev => setProjectname(ev.target.value)} /><br />
        <textarea  className="form-input-field" placeholder='Enter the Address' value={address} onChange={ev => setAddress(ev.target.value)}></textarea><br />

        <input  className="form-input-field" type='file' onChange={ev => setFiles([...ev.target.files])} accept='.webp' multiple /><br />
        <ReactQuill value={content} onChange={newValue => setContent(newValue)} /><br />
        <label  className="form-input-field">Category</label><br />
        <select value={category} onChange={ev => setCategory(ev.target.value)} >
          <option>Select Option</option>
          <option>Womeki Group</option>
          <option>WIC</option>
          <option>Womeki Infra</option>
          <option>Womeki Tech</option>
          <option>Womeki holiday club</option>
        </select><br />
        <label  className="form-input-field">Subcategory</label><br />
        <select className='mb-3' value={subcategory} onChange={ev => setSubcategory(ev.target.value)} >
          <option>Select Option</option>
          <option>Recent</option>
          <option>Upcoming</option>
          <option>Exclusive</option>
          <option>Featured</option>
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
        <label  className="form-input-field">Select Price Option</label><br />
        <select value={price} onChange={ev => setPrice(ev.target.value)}>
          <option>select option</option>
          <option>Price on request</option>
        </select><br />
        <div className='center'><button  className="addbutton">Create Post</button></div>
      </form>
      </div>
    </div>
  );
}

export default AdminPanel;
