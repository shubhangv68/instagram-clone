import React from 'react';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container mt-5 text-center">
      <h2>Feed</h2>
      <p>Welcome to your feed!</p>
      <button onClick={handleLogout} className="btn btn-danger">
        Logout
      </button>
    </div>
  );
};

export default Feed;
