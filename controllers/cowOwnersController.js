const db = require('../config/db')

const getCowOwners = async (req, res) => {
    res.render('cow-owners');
};

const getCowOwnerOne = async (req, res) => {
    res.render('cow-owners-one');
};

const getAddCowOwnerPage = async (req, res) => {
    db.all("SELECT id, name FROM milk_collectors WHERE is_active = 1", [], (err, collectors) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Error fetching milk collectors");
            return;
        }

        res.render('cowowner-add', { collectors });
    })
}

const addCowOwner = async (req, res)=>{
    const { name, contact_no, address, milk_collector_id, village_name, cow_count, milk_price } = req.body

  if (!name || !contact_no || !cow_count || !milk_price) {
    return res.status(400).json({ message: 'Name, contact number, cow count and milk price are required.' });
  }

  const query = `
    INSERT INTO milk_producers (name, contact_no, address, milk_collector_id, village_name, cow_count, milk_price )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [name, contact_no, address, milk_collector_id, village_name, cow_count, milk_price], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Could not add milk producers', error: err.message });
    }

    res.status(201).json({ message: 'Milk producer added successfully', id: this.lastID });
  });
}

module.exports = { getCowOwners, getCowOwnerOne, getAddCowOwnerPage, addCowOwner };