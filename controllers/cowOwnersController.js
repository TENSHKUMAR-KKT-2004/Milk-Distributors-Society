const db = require('../config/db')

const getCowOwners = async (req, res) => {
  try {
    db.all("SELECT * FROM milk_producers WHERE is_active = 1", [], (err, activeProducers) => {
      if (err) {
        console.error("Error fetching active producers:", err);
        return res.status(500).send("Error fetching active producers");
      }

      db.all("SELECT * FROM milk_producers WHERE is_active = 0", [], (err, inactiveProducers) => {
        if (err) {
          console.error("Error fetching inactive producers:", err);
          return res.status(500).send("Error fetching inactive producers");
        }

        res.render('cow-owners', {
          activeProducers: activeProducers || [],
          inactiveProducers: inactiveProducers || []
        });
      });
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
};

const getCowOwnerOne = async (req, res) => {
  const producerId = req.params.id
  try {
    db.get("SELECT * FROM milk_producers WHERE id = ?", [producerId], (err, producer) => {
      if (err) {
        console.error("Error fetching cow owner:", err);
        return res.status(500).send("Error fetching cow owner");
      }

      if (!producer) {
        return res.status(404).send("Cow owner not found");
      }

      res.render('cow-owners-one', {
        producer: producer
      });
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
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

const getEditCowOwnerPage = async (req, res) => {
  try {
    db.all("SELECT * FROM milk_producers WHERE is_active = 1", [], (err, producers) => {
      if (err) {
        return res.status(500).send('Error fetching producers');
      }

      db.all("SELECT id, name FROM milk_collectors WHERE is_active = 1", [], (err, collectors) => {
        if (err) {
          console.error(err.message);
          res.status(500).send("Error fetching milk collectors");
          return;
        }
        res.render('cowowner-edit', { producers, collectors });

      })
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
}

const addCowOwner = async (req, res) => {
  const { name, contact_no, address, milk_collector_id, village_name, cow_count, milk_price } = req.body

  try {
    if (!name || !contact_no || !cow_count || !milk_price) {
      return res.status(400).json({ message: 'Name, contact number, cow count and milk price are required.' });
    }

    const query = `
    INSERT INTO milk_producers (name, contact_no, address, milk_collector_id, village_name, cow_count, milk_price )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

    db.run(query, [name, contact_no, address, milk_collector_id, village_name, cow_count, milk_price], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Could not add milk producers', error: err.message });
      }

      res.status(201).json({ message: 'Milk producer added successfully', id: this.lastID });
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
}

const updateCowOwner = async (req, res) => {
  const { id, name, cow_count, milk_price, milk_collector_id, contact_no, address, village_name } = req.body;

  try {
    const query = `
    UPDATE milk_producers
    SET name = ?, cow_count = ?, milk_price = ?, milk_collector_id = ?, contact_no = ?, address = ?, village_name = ?
    WHERE id = ?
  `;

    db.run(query, [name, cow_count, milk_price, milk_collector_id, contact_no, address, village_name, id], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating producer details' });
      }
      res.json({ message: 'Producer details updated successfully!' });
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
};

const activateCowOwner = async (req,res)=>{
  const producerId = req.params.id
  try {
    const query = `
    UPDATE milk_producers
    SET is_active = 1
    WHERE id = ?
  `;
    db.get(query, [producerId], (err, producer) => {
      if (err) {
        console.error("Error while active the cow owner:", err);
        return res.status(500).send("Error while active the cow owner");
      }

      if (!producer) {
        return res.status(404).send("Cow owner not found");
      }

      return res.status(200).send("Cow owner activated successfully!");
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
}

const deactivateCowOwner = async (req,res)=>{
  const producerId = req.params.id
  try {
    const query = `
    UPDATE milk_producers
    SET is_active = 0
    WHERE id = ?
  `;
    db.get(query, [producerId], (err, producer) => {
      if (err) {
        console.error("Error while deactive the cow owner:", err);
        return res.status(500).send("Error while deactive the cow owner");
      }

      if (!producer) {
        return res.status(404).send("Cow owner not found");
      }

      return res.status(200).send("Cow owner deactivated successfully!");
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = { getCowOwners, getCowOwnerOne, getAddCowOwnerPage, addCowOwner, getEditCowOwnerPage, updateCowOwner, activateCowOwner, deactivateCowOwner };