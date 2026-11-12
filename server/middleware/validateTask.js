// Validation for the task body, runs before the route handlers.
// The client checks the same rules, but the API has to protect itself
// too since anyone can call it directly.

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function isValidDate(value) {
  if (!DATE_RE.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  // catches things like 2026-02-31 which pass the regex but aren't real
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

function validateTask(req, res, next) {
  const { title, description, date, startTime, endTime, priority, status } = req.body || {};
  const errors = [];

  if (typeof title !== 'string' || !title.trim()) {
    errors.push('Title is required');
  } else if (title.trim().length > 100) {
    errors.push('Title cannot be longer than 100 characters');
  }

  if (description && description.trim().length > 500) {
    errors.push('Description cannot be longer than 500 characters');
  }

  if (!date) {
    errors.push('Date is required');
  } else if (typeof date !== 'string' || !isValidDate(date)) {
    errors.push('Date must be a valid date in YYYY-MM-DD format');
  }

  if (!startTime) {
    errors.push('Start time is required');
  } else if (typeof startTime !== 'string' || !TIME_RE.test(startTime)) {
    errors.push('Start time must be a valid time in HH:MM format');
  }

  if (endTime) {
    if (typeof endTime !== 'string' || !TIME_RE.test(endTime)) {
      errors.push('End time must be a valid time in HH:MM format');
    } else if (startTime && TIME_RE.test(startTime) && endTime <= startTime) {
      errors.push('End time must be after the start time');
    }
  }

  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    errors.push('Priority must be low, medium or high');
  }

  if (status && !['open', 'in-progress', 'completed'].includes(status)) {
    errors.push('Status must be open, in-progress or completed');
  }

  if (errors.length) {
    return res.status(400).json({ message: errors[0], errors });
  }

  next();
}

module.exports = validateTask;
