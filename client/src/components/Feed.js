import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from './NavBar';
import Post from './Post';
import { io } from 'socket.io-client';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Fetch posts function wrapped in useCallback to prevent re-creation
  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
    } catch (error) {
      console.error('Error fetching posts', error);
    }
  }, [token]);

  // Initialize WebSocket connection & listen for real-time updates
  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);

    newSocket.on('postLiked', (postId) => {
      console.log(`Post ${postId} was liked`);
      fetchPosts();
    });

    newSocket.on('postCommented', (postId) => {
      console.log(`Post ${postId} received a comment`);
      fetchPosts();
    });

    return () => {
      newSocket.disconnect(); // Cleanup on unmount
    };
  }, [fetchPosts]); // Ensure fetchPosts is always the latest function

  // Fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <NavBar userId={userId} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Feed</h2>
        <div>
          <Link to="/create-post" className="btn btn-primary me-2">
            Create Post
          </Link>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {posts.length === 0 ? <p>No posts yet.</p> : posts.map(post => (
        <Post key={post._id} post={post} fetchPosts={fetchPosts} />
      ))}
    </div>
  );
};

export default Feed;