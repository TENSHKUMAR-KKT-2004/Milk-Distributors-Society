const db = require('../config/db')

const getMilkers = async (req, res) => {
  try {
    db.all("SELECT * FROM milk_collectors WHERE is_active = 1", [], (err, activeCollectors) => {
      if (err) {
        console.error("Error fetching active collectors:", err);
        return res.status(500).send("Error fetching active collectors");
      }

      db.all("SELECT * FROM milk_collectors WHERE is_active = 0", [], (err, inactiveCollectors) => {
        if (err) {
          console.error("Error fetching inactive collectors:", err);
          return res.status(500).send("Error fetching inactive collectors");
        }

        res.render('milkers', {
          activeCollectors: activeCollectors || [],
          inactiveCollectors: inactiveCollectors || []
        });
      });
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
};

const getMilkerOne = async (req, res) => {
  const collectorId = req.params.id
  try {
    db.get("SELECT * FROM milk_collectors WHERE id = ?", [collectorId], (err, collector) => {
      if (err) {
        console.error("Error fetching cow milk collector:", err);
        return res.status(500).send("Error fetching cow milk collector");
      }

      if (!collector) {
        return res.status(404).send("cow milk collector not found");
      }

      res.render('milkers-one', {
        collector: collector
      });
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
};

const getAddMilkersPage = async (req, res) => {
  res.render('milker-add');
};

const getEditMilkersPage = async (req, res)=>{
  try {
    db.all("SELECT * FROM milk_collectors WHERE is_active = 1", [], (err, collectors) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Error fetching milk collectors");
        return;
      }
      res.render('milker-edit', { collectors });
    })
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
}

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

const updateMilkCollector = async (req, res) => {
  const { id, name, salary, contact_no, address, village_name } = req.body;

  try {
    const query = `
    UPDATE milk_collectors
    SET name = ?, contact_no = ?, address = ?, village_name = ?, salary = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

    db.run(query, [name, contact_no, address, village_name, salary, id], function (err) {
      if (err) {
        console.log(err)
        return res.status(500).json({ message: 'Error updating collector details' });
      }
      res.json({ message: 'Collector details updated successfully!' });
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
}

const activateMilkCollector = async (req,res)=>{
  const collectorId = req.params.id
  try {
    const query = `
    UPDATE milk_collectors
    SET is_active = 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
    db.get(query, [collectorId], (err, collector) => {
      if (err) {
        console.error("Error while active the milk collectors :", err);
        return res.status(500).send("Error while active the milk collectors");
      }

      if (!collector) {
        return res.status(404).send("milk collectors not found");
      }

      return res.status(200).send("Milk collectors activated successfully!");
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
}

const deactivateMilkCollector = async (req,res)=>{
  const collectorId = req.params.id
  try {
    const query = `
    UPDATE milk_collectors
    SET is_active = 0, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
    db.get(query, [collectorId], (err, collector) => {
      if (err) {
        console.error("Error while active the milk collectors :", err);
        return res.status(500).send("Error while active the milk collectors");
      }

      if (!collector) {
        return res.status(404).send("milk collectors not found");
      }

      return res.status(200).send("Milk collectors activated successfully!");
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = { getMilkers, getMilkerOne, getAddMilkersPage,  addMilkCollector, getEditMilkersPage, updateMilkCollector, activateMilkCollector, deactivateMilkCollector };