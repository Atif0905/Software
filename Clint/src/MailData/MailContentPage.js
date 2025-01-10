import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Confirmation/Loader';

const MailContentPage = () => {
  const [mailContent, setMailContent] = useState({
    Subject: '',
    Body: '',
    Lastdata: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch default mail content on page load
  useEffect(() => {
    const fetchMailContent = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Mailcontent`);
        setMailContent(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching mail content:', error);
        setIsLoading(false);
      }
    };

    fetchMailContent();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMailContent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission for updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/Mailcontent`, mailContent);
      alert('Mail content updated successfully!');
      setMailContent(response.data.mailContent);
    } catch (error) {
      console.error('Error updating mail content:', error);
      alert('Failed to update mail content.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <p><Loader/></p>;

  return (
    <div className='formback mt-3'>
      <h1 className='formhead'>Customise Your Mail Content</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="Subject" style={{ display: 'block'}}>Subject:</label>
          <input
            type="text"
            id="Subject"
            name="Subject"
            placeholder='Enter Your Subject For Mail'
            value={mailContent.Subject}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
        </div>
        <div >
          <label htmlFor="Body" style={{ display: 'block'}}>Body:</label>
          <textarea
            id="Body"
            name="Body"
            value={mailContent.Body}
            onChange={handleChange}
            placeholder='Enter Your Body For Mail'
            rows="5"
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          ></textarea>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="Lastdata" style={{ display: 'block'}}>Lastdata:</label>
          <input
            type="text"
            id="Lastdata"
            name="Lastdata"
            placeholder='Enter Your Signature For Mail'
            value={mailContent.Lastdata}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
        </div>
        <div className='center'>
        <button
          type="submit"
          disabled={isUpdating}
          className='addbutton'
        >
          {isUpdating ? 'Updating...' : 'Update'}
        </button>
        </div>
      </form>
    </div>
  );
};

export default MailContentPage;
