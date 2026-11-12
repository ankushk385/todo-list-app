const express = require('express');
const Task = require('../models/Task');
const validateTask = require('../middleware/validateTask');

const router = express.Router();

// mongo ids are 24 hex chars - anything else means the url was mistyped,
// so we can answer right away instead of letting mongoose throw
const ID_RE = /^[0-9a-fA-F]{24}$/;

// escape regex special chars so the search term is matched literally
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// GET /api/tasks?search=something
router.get('/', async (req, res) => {
  try {
    const search = (req.query.search || '').toString().trim();
    let filter = {};

    if (search) {
      const pattern = new RegExp(escapeRegex(search), 'i');
      filter = { $or: [{ title: pattern }, { description: pattern }] };
    }

    const tasks = await Task.find(filter).sort({ date: 1, startTime: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load tasks' });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  if (!ID_RE.test(req.params.id)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load the task' });
  }
});

// POST /api/tasks
router.post('/', validateTask, async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not create the task' });
  }
});

// PUT /api/tasks/:id - full update, the form always sends every field
router.put('/:id', validateTask, async (req, res) => {
  if (!ID_RE.test(req.params.id)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not update the task' });
  }
});

// PATCH /api/tasks/:id/status - quick toggle from the task list
router.patch('/:id/status', async (req, res) => {
  if (!ID_RE.test(req.params.id)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }
  const { status } = req.body || {};
  if (!['open', 'in-progress', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not update the status' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  if (!ID_RE.test(req.params.id)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete the task' });
  }
});

module.exports = router;
