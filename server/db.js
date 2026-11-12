const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// If MONGO_URI is set (a local MongoDB install, Atlas, ...) we use that.
// Otherwise we start a local MongoDB with mongodb-memory-server - it
// downloads a real mongod binary so nothing has to be installed by hand,
// and keeps its files in ./data so tasks survive a restart.
async function connectDB() {
  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    return;
  }

  const dbPath = path.join(__dirname, 'data');
  fs.mkdirSync(dbPath, { recursive: true });

  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongo = await MongoMemoryServer.create({
    // 7.0 - the 8.x binary needs macOS 13+, this mac runs 12
    binary: { version: '7.0.14' },
    instance: {
      dbPath,
      storageEngine: 'wiredTiger',
    },
  });

  await mongoose.connect(mongo.getUri('todo-app'));
  console.log('Started local MongoDB (mongodb-memory-server)');
}

module.exports = connectDB;
