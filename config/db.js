const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../db/milk_distributor.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error when creating the database', err);
  } else {
    console.log('Database created/connected successfully!');
  }
});

module.exports = db;
