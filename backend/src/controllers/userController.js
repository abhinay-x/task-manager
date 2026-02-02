const User = require('../models/User');

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('_id name email');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name ?? user.name;
  user.email = req.body.email ?? user.email;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
  });
});

module.exports = { getMe, updateMe };
