const Task = require('./models/Task');

// Inserts a few sample tasks the first time the API runs, so the app
// isn't completely empty when somebody opens it for the first time.
async function seed() {
  const count = await Task.countDocuments();
  if (count > 0) return;

  // monday of the current week
  const now = new Date();
  const dayIndex = (now.getDay() + 6) % 7; // Mon = 0 ... Sun = 6
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayIndex);

  // helper: date of the current week as YYYY-MM-DD (offset 0 = monday)
  function at(offset) {
    const d = new Date(monday);
    d.setDate(d.getDate() + offset);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  await Task.insertMany([
    {
      title: 'Finishing Wireframe',
      description: 'Go through the wireframe feedback and apply the changes',
      date: at(0),
      startTime: '10:00',
      endTime: '12:00',
      priority: 'high',
      status: 'in-progress',
    },
    {
      title: 'Meeting with team',
      description: 'Weekly sync about the sprint progress',
      date: at(1),
      startTime: '14:00',
      priority: 'medium',
      status: 'open',
    },
    {
      title: 'Buy a cat food',
      date: at(2),
      startTime: '18:30',
      priority: 'low',
      status: 'open',
    },
    {
      title: 'Finishing daily commission',
      date: at(4),
      startTime: '09:00',
      priority: 'medium',
      status: 'completed',
    },
    {
      title: 'Design review',
      description: 'Review the new screens with the design team',
      date: at(5),
      startTime: '11:00',
      endTime: '12:30',
      priority: 'high',
      status: 'open',
    },
    {
      // a finished task from last week so the weeks screen has some history
      title: 'Prepare presentation',
      date: at(-4),
      startTime: '16:00',
      priority: 'low',
      status: 'completed',
    },
  ]);

  console.log('Seeded sample tasks');
}

module.exports = seed;
