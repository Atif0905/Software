import { useEffect, useState } from 'react';
import axios from 'axios';
const useFetchUser = () => {
  const [user, setUser] = useState(null);
  const [subAdmin, setSubAdmin] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const storedEmail = window.localStorage.getItem("email");
        if (storedEmail) {
          setEmail(storedEmail);
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/getAllUser`);
          
          const { users, subAdmins } = response.data.data;const matchedUser = users.find(user => user.email === storedEmail);
          const matchedSubAdmin = subAdmins.find(subAdmin => subAdmin.email === storedEmail);
          if (matchedUser) {
            setUser(matchedUser);
          }
          
          if (matchedSubAdmin) {
            setSubAdmin(matchedSubAdmin);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  return { user, subAdmin, email, loading, error };
};
export default useFetchUser;