const db = require('../config/db')

const getCowOwners = async (req, res) => {
  try {
    db.all("SELECT * FROM milk_producers WHERE is_active = 1", [], (err, activeProducers) => {
      if (err) {
        console.error("Error fetching active producers:", err);
        return res.status(500).json({message:"Error fetching active producers",error:err.message});
      }

      db.all("SELECT * FROM milk_producers WHERE is_active = 0", [], (err, inactiveProducers) => {
        if (err) {
          console.error("Error fetching inactive producers:", err);
          return res.status(500).json({message:"Error fetching inactive producers",error:err.message});
        }

        res.render('cow-owners', {
          activeProducers: activeProducers || [],
          inactiveProducers: inactiveProducers || []
        });
      });
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).json({message:'Internal Server Error',error:err.message});
  }
};

const getCowOwnerOne = async (req, res) => {
  const producerId = req.params.id
  try {
    db.get("SELECT * FROM milk_producers WHERE id = ?", [producerId], (err, producer) => {
      if (err) {
        console.error("Error fetching cow owner:", err);
        return res.status(500).json({message:"Error fetching cow owner",error:err.message});
      }

      if (!producer) {
        return res.status(404).json({message:"Cow owner not found",error:err.message});
      }

      res.render('cow-owners-one', {
        producer: producer
      });
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).json({message:'Internal Server Error',error:err.message});
  }
};

const getAddCowOwnerPage = async (req, res) => {
  db.all("SELECT id, name FROM milk_collectors WHERE is_active = 1", [], (err, collectors) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({message:"Error fetching milk collectors",error:err.message});
      return;
    }

    res.render('cowowner-add', { collectors });
  })
}

const getEditCowOwnerPage = async (req, res) => {
  try {
    db.all("SELECT * FROM milk_producers WHERE is_active = 1", [], (err, producers) => {
      if (err) {
        return res.status(500).json({message:'Error fetching producers', error: err.message});
      }

      db.all("SELECT id, name FROM milk_collectors WHERE is_active = 1", [], (err, collectors) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({message:"Error fetching milk collectors",error:err.message});
          return;
        }
        res.render('cowowner-edit', { producers, collectors });

      })
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).json({message:'Internal Server Error',error:err.message});
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
    res.status(500).json({message:'Internal Server Error',error:err.message});
  }
}

const updateCowOwner = async (req, res) => {
  const { id, name, cow_count, milk_price, milk_collector_id, contact_no, address, village_name } = req.body;

  try {
    const query = `
    UPDATE milk_producers
    SET name = ?, cow_count = ?, milk_price = ?, milk_collector_id = ?, contact_no = ?, address = ?, village_name = ?, updated_at = CURRENT_TIMESTAMP
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
    res.status(500).json({message:'Internal Server Error',error:err.message});
  }
};

const activateCowOwner = async (req,res)=>{
  const producerId = req.params.id
  try {
    const query = `
    UPDATE milk_producers
    SET is_active = 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
    db.get(query, [producerId], (err, producer) => {
      if (err) {
        console.error("Error while active the cow owner:", err);
        return res.status(500).json({message:"Error while active the cow owner",error:err.message});
      }

      if (!producer) {
        return res.status(404).json({message: "Cow owner not found"});
      }

      return res.status(200).json({message: "Cow owner activated successfully!"});
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).json({message:'Internal Server Error',error:err.message});
  }
}

const deactivateCowOwner = async (req,res)=>{
  const producerId = req.params.id
  try {
    const query = `
    UPDATE milk_producers
    SET is_active = 0, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
    db.get(query, [producerId], (err, producer) => {
      if (err) {
        console.error("Error while deactive the cow owner:", err);
        return res.status(500).json({message:"Error while deactive the cow owner"});
      }

      if (!producer) {
        return res.status(404).json({message:"Cow owner not found"});
      }

      return res.status(200).json({message:"Cow owner deactivated successfully!"});
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).json({message:'Internal Server Error',error:err.message});
  }
}

module.exports = { getCowOwners, getCowOwnerOne, getAddCowOwnerPage, addCowOwner, getEditCowOwnerPage, updateCowOwner, activateCowOwner, deactivateCowOwner };