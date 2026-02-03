const User = require('../models/User');

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('_id name email');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    console.log('updateMe called with body:', req.body);
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const incomingName = req.body.name?.trim();
    const incomingEmail = req.body.email?.trim();

    if (incomingEmail && incomingEmail !== user.email) {
      res.status(400);
      throw new Error('Email updates are not allowed.');
    }

    if (incomingName) {
      user.name = incomingName;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    console.error('updateMe error:', error);
    next(error);
  }
};

module.exports = { getMe, updateMe };
