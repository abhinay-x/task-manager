const Task = require('../models/Task');

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

const buildTaskQuery = (req) => ({ _id: req.params.id, user: req.user._id });

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(tasks);
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  const task = new Task({
    title,
    description,
    status,
    priority,
    dueDate: dueDate || null,
    user: req.user._id,
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne(buildTaskQuery(req));

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json(task);
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne(buildTaskQuery(req));

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const { title, description, status, priority, dueDate } = req.body;

  task.title = title ?? task.title;
  task.description = description ?? task.description;
  task.status = status ?? task.status;
  task.priority = priority ?? task.priority;
  task.dueDate = dueDate || null;

  const updatedTask = await task.save();
  res.json(updatedTask);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne(buildTaskQuery(req));

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.deleteOne();
  res.json({ message: 'Task removed' });
});

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
};
