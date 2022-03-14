import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavBar from './NavBar';

const Profile = () => {
  const { id } = useParams(); // Profile user ID
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId'); // Logged-in user ID
  const [user, setUser] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch User Profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(res.data);
        setBio(res.data.profile?.bio || '');
        setAvatar(res.data.profile?.avatar || '');
        setFollowersCount(res.data.followers?.length || 0);
        setIsFollowing(res.data.followers?.includes(userId) || false);
      } catch (error) {
        setErrorMsg('Failed to fetch user profile');
      }
    };

    fetchUserProfile();
  }, [id, token, userId]);

  // Handle Follow / Unfollow
  const handleFollow = async () => {
    try {
      const res = await axios.put(`http://localhost:8000/api/users/follow/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsFollowing(res.data.isFollowing);
      setFollowersCount(res.data.followersCount);
    } catch (error) {
      console.error('Error following/unfollowing user', error);
    }
  };

  // Handle Profile Picture Change
  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  // Handle Profile Update (Bio & Avatar)
  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('bio', bio);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await axios.put(`http://localhost:8000/api/users/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setUser(res.data);
      setEditing(false);
    } catch (error) {
      setErrorMsg('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <NavBar userId={userId} />
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <div className="card mb-3">
        <div className="card-body text-center">
          {/* Profile Picture */}
          <img
            src={
              avatar
                ? `http://localhost:8000/${avatar}?cb=${new Date().getTime()}`
                : 'https://via.placeholder.com/150'
            }
            alt="Profile"
            className="img-thumbnail mb-3"
            style={{ width: '150px', borderRadius: '50%' }}
          />

          <h2>{user.username}</h2>
          <p><strong>Followers:</strong> {followersCount}</p>
          <p><strong>Following:</strong> {user.following?.length || 0}</p>

          {/* Follow/Unfollow Button (Only for Other Users) */}
          {userId !== id && (
            <button className={`btn ${isFollowing ? 'btn-danger' : 'btn-primary'}`} onClick={handleFollow}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}

          {/* Profile Editing Section */}
          {!editing ? (
            <div>
              <p>{bio}</p>
              {userId === id && (
                <button className="btn btn-secondary mt-2" onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
              )}
            </div>
          ) : (
            <div className="mt-3">
              <div className="mb-3">
                <label htmlFor="bio" className="form-label">Bio:</label>
                <textarea
                  id="bio"
                  className="form-control"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="avatar" className="form-label">Profile Picture:</label>
                <input
                  type="file"
                  id="avatar"
                  className="form-control"
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
              </div>
              <button className="btn btn-primary me-2" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;