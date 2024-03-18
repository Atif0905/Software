import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const BlogPanel = () => {
  const[name, setName] = useState('');
  const[description, setDescription] = useState('');
  const[content, setContent] = useState('');
  const[files, setFiles] = useState('');
 const[direct, setDirect] = useState(false); 
 const [blogs, setBlogs] = useState([]);
  const[category, setCategory] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/createblog`);
        console.log(response)
        if (response.status === 200) {
          setBlogs(response.data); 
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();
  }, []);
 async function createNewBlog(ev) {
  ev.preventDefault();

  const data = new FormData();
  data.set('name', name);
  data.set('description', description);
  data.set('content', content);
  for (let i = 0; i < files.length; i++) {
    data.append('files', files[i]);
  }
  data.set('category', category)
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/createblog`, data);
    if (response.status === 200) {
      setDirect(true);
      setName('');
      setDescription('');
      setContent('');
      setFiles('');
    }
  } catch (error) {
    console.error('Error creating post:', error);
  }
}
  return (
    <div className='container'>
     <div className='d-flex form-nav mt-4'>
      </div>
      <h2 className='text-center'>Create Blog</h2>
    <form onSubmit={createNewBlog}>
      <input className='mt-3' type='title' placeholder='Enter Blog Name ' value={name} onChange={ev => setName(ev.target.value)} /><br/>
      <textarea className='mt-3' placeholder='Enter Description' value={description} onChange={ev => setDescription(ev.target.value)}></textarea><br/>
      <input className='mt-3' type='file' onChange={ev => setFiles([...ev.target.files])} accept='.webp' multiple /><br />
      <select className='mb-3'  value={category} onChange={ev => setCategory(ev.target.value)}>
      <option>Select Option</option>
      <option>WIC</option>
      <option>Womeki Infra</option>
      <option>Womeki Tech</option>
      <option>Womeki holiday club</option>
      </select>
     <ReactQuill value={content} onChange={newValue => setContent(newValue)}/><br/>
     <button className='mt-3'>Create Post</button>
    </form>
  </div>
  )
}

export default BlogPanel