import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const BlogPanel = () => {
  const[name, setName] = useState('');
  const[description, setDescription] = useState('');
  const[content1, setContent1] = useState('');
  const[content2, setContent2] = useState('');
  const[content3, setContent3] = useState('');
  const[content4, setContent4] = useState('');
  const[content5, setContent5] = useState('');
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
  data.set('content1', content1);
  data.set('content2', content2);
  data.set('content3', content3);
  data.set('content4', content4);
  data.set('content5', content5);
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
      setContent1('');
      setContent2('');
      setContent3('');
      setContent4('');
      setContent5('');
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
      <option>Womeki Group</option>
      <option>WIC</option>
      <option>Womeki Infra</option>
      <option>Womeki Tech</option>
      <option>Womeki holiday club</option>
      </select>
     <ReactQuill value={content1} onChange={newValue => setContent1(newValue)}/><br/>
     <ReactQuill value={content2} onChange={newValue => setContent2(newValue)}/><br/>
     <ReactQuill value={content3} onChange={newValue => setContent3(newValue)}/><br/>
     <ReactQuill value={content4} onChange={newValue => setContent4(newValue)}/><br/>
     <ReactQuill value={content5} onChange={newValue => setContent5(newValue)}/><br/>
     <button className='mt-3'>Create Post</button>
    </form>
  </div>
  )
}

export default BlogPanel