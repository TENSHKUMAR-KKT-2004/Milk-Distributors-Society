const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database('./db/milk_distributor.db', (err) => {
  if (err) {
    console.error('Error when creating the database', err);
  } else {
    console.log('Database created/connected successfully!');
  }
});

module.exports = db;
