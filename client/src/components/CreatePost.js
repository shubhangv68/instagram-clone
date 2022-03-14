import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim()) {
      setErrorMsg('Caption cannot be empty.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('caption', caption);
    if (image) formData.append('image', image);

    try {
      const res = await axios.post('http://localhost:8000/api/posts', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Post Created:', res.data); // ✅ Log response from backend

      setCaption('');
      setImage(null);
      setErrorMsg('');
      navigate('/feed');
    } catch (error) {
      console.error('Create post error:', error.response?.data || error.message);
      setErrorMsg(error.response?.data?.message || 'Error creating post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Post</h2>
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
      <form onSubmit={handlePostSubmit}>
        <div className="mb-3">
          <label className="form-label">Caption</label>
          <input
            type="text"
            className="form-control"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;