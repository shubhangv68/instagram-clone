const User = require('../models/User');

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // Exclude password and any other sensitive data
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    let updateData = { 'profile.bio': req.body.bio };

    if (req.file) {
      updateData['profile.avatar'] = req.file.path;
    } else if (req.body.avatar) {
      updateData['profile.avatar'] = req.body.avatar;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const { id } = req.params; // ID of the user to follow/unfollow
    const userId = req.user.id; // Logged-in user ID

    if (userId === id) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(userId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.following.includes(id)) {
      // Unfollow
      currentUser.following.pull(id);
      userToFollow.followers.pull(userId);
    } else {
      // Follow
      currentUser.following.push(id);
      userToFollow.followers.push(userId);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({ message: 'Follow status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};