import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const RedirectToProfile = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        navigate(`/profile/${userId}`);
      } catch (error) {
        console.error('Token decode error', error);
        navigate('/login');
      }
    }
  }, [navigate]);

  return null;
};

export default RedirectToProfile;
