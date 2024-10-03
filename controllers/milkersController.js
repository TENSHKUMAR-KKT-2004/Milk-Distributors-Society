const db = require('../config/db')

const getMilkers = async (req, res) => {
  res.render('milkers');
};

const getMilkerOne = async (req, res) => {
  res.render('milkers-one');
};

const getAddMilkersPage = async (req, res) => {
  res.render('milker-add');
};

const addMilkCollector = async (req, res) => {
  const { name, contact_no, address, village_name, salary } = req.body

  if (!name || !contact_no || !salary) {
    return res.status(400).json({ message: 'Name, contact number, and salary are required.' });
  }

  const query = `
    INSERT INTO milk_collectors (name, contact_no, address, salary, village_name)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [name, contact_no, address, salary, village_name], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Could not add milk collector', error: err.message });
    }

    res.status(201).json({ message: 'Milk collector added successfully', id: this.lastID });
  });
}

module.exports = { getMilkers, getMilkerOne, getAddMilkersPage,  addMilkCollector };