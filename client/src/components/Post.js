import React, { useState } from 'react';
import axios from 'axios';

const Post = ({ post, fetchPosts }) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId'); // ✅ Fix: Define userId
  const [commentText, setCommentText] = useState('');

  // Handle Post Deletion
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts(); // Refresh feed after deletion
    } catch (error) {
      console.error('Error deleting post', error);
    }
  };

  // Handle Like
  const handleLike = async () => {
    try {
      await axios.put(`http://localhost:8000/api/posts/${post._id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts(); // Refresh likes count
    } catch (error) {
      console.error('Error liking post', error);
    }
  };

  // Handle Comment Submission
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return; // Prevent empty comments

    try {
      await axios.post(
        `http://localhost:8000/api/posts/${post._id}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText('');
      fetchPosts(); // Refresh comments section
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{post.user.username}</h5>
        
        {/* Render Post Image (if available) */}
        {post.image && (
          <img
            src={`http://localhost:8000/${post.image}`}
            alt="Post"
            className="img-fluid mb-3"
          />
        )}

        <p className="card-text">{post.caption}</p>

        {/* Like Button */}
        <button className="btn btn-sm btn-outline-primary me-2" onClick={handleLike}>
          👍 {post.likes.length} Likes
        </button>

        {/* Delete Button (Only for Post Owner) */}
        {post.user._id === userId && (
          <button className="btn btn-sm btn-danger" onClick={handleDelete}>
            Delete
          </button>
        )}

        {/* Comments Section */}
        <div className="mt-3">
          <h6>Comments</h6>
          {post.comments.length === 0 ? (
            <p>No comments yet</p>
          ) : (
            post.comments.map((comment, index) => (
              <div key={index} className="border p-2 mb-2">
                <strong>{comment.user.username}:</strong> {comment.text}
              </div>
            ))
          )}

          {/* Add Comment Form */}
          <form onSubmit={handleComment}>
            <div className="input-group mt-2">
              <input
                type="text"
                className="form-control"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Post;