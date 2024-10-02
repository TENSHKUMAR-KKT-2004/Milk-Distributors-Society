const db = require('../config/db');

const findUserByUsername = (username, callback) => {
  const query = 'SELECT * FROM user_access WHERE username = ?';
  db.all(query, [username], (err, results) => {
      if (err) {
          console.error('Database query error:', err);
          return callback(err, null);
      }
      callback(null, results);
  });
};

const createUser = (username, hashedPassword, callback) => {
  const query = 'INSERT INTO user_access (username, password) VALUES (?, ?)';
  db.run(query, [username, hashedPassword], function (err) {
    callback(err, { id: this.lastID });
  });
};

module.exports = {
  findUserByUsername,
  createUser,
};
