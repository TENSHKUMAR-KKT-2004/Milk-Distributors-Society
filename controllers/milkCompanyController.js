const db = require('../config/db')

const getMilkCompanyPage = async (req, res) => {
    try {
        db.all("SELECT * FROM companies WHERE is_active = 1", [], (err, companies) => {
            if (err) {
                return res.status(500).send('Error fetching companies');
            }

            res.render('milk-company', { companies });

        });
    } catch (err) {
        console.error('Error fetching data from the database:', err);
        res.status(500).send('Internal Server Error');
    }
};

const getAddMilkCompanyPage = async (req, res) => {
    res.render('milkcompany-add');
};

const getEditMilkCompanyPage = async (req, res) => {
    try {
        db.all("SELECT * FROM companies WHERE is_active = 1", [], (err, companies) => {
            if (err) {
                return res.status(500).send('Error fetching companies');
            }

            res.render('milkcompany-edit', { companies });

        });
    } catch (err) {
        console.error('Error fetching data from the database:', err);
        res.status(500).send('Internal Server Error');
    }
};

const getMilkSalesPage = async (req, res) => {
    try {
        db.all("SELECT * FROM companies WHERE is_active = 1", [], (err, companies) => {
            if (err) {
                return res.status(500).send('Error fetching companies');
            }

            res.render('milk-sales', { companies });

        });
    } catch (err) {
        console.error('Error fetching data from the database:', err);
        res.status(500).send('Internal Server Error');
    }
};

const addCompany = async (req, res) => {
    const { name, contact_no, incentive_price, address } = req.body;
    try {
        if (!name || !contact_no || !incentive_price || !address) {
            return res.status(400).json({ message: 'All details are required.' });
        }

        const query = `
        INSERT INTO companies (name, contact_no, incentive_price, address) 
                 VALUES (?, ?, ?, ?)
      `;

        db.run(query, [name, contact_no, incentive_price, address], function (err) {
            if (err) {
                return res.status(500).json({ message: 'Could not add company', error: err.message });
            }

            res.status(201).json({ message: 'Milk company added successfully', id: this.lastID });
        });
    } catch (err) {
        console.error('Error fetching data from the database:', err);
        res.status(500).send('Internal Server Error');
    }
}

const updateCompany = async (req, res) => {
    const { id, name, contact_no, address, incentive_price } = req.body;

    try {
        const query = `
      UPDATE companies 
                 SET name = ?, contact_no = ?, address = ?, incentive_price = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`;

        db.run(query, [name, contact_no, address, incentive_price, id], function (err) {
            if (err) {
                return res.status(500).json({ message: 'Error updating company details' });
            }
            res.json({ message: 'company details updated successfully!' });
        });
    } catch (err) {
        console.error('Error fetching data from the database:', err);
        res.status(500).send('Internal Server Error');
    }
};

const addMilkSaleRecord = async (req, res) => {
    try {
        const {
            date,
            collection_time,
            company_id,
            distributed_milk_qty,
            FAT,
            SNF,
            price_per_liter,
            incentive_price,
            total_amt
        } = req.body;

        if (company_id === 'other') {
            insertMilkDistribution();
        } else {
            const query = `
          SELECT * FROM milk_distributions 
          WHERE date = ? AND collection_time = ? AND company_id = ?;
        `;

            db.get(query, [date, collection_time, company_id], (err, row) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error', error: err });
                }

                if (row) {
                    return res.status(400).json({
                        message: `Record already exists for ${company_id} on ${date} at ${collection_time}.`
                    });
                }
                insertMilkDistribution();
            });
        }

        function insertMilkDistribution() {
            const insertQuery = `
          INSERT INTO milk_distributions 
          (date, collection_time, company_id, distributed_milk_qty, FAT, SNF, price_per_liter, total_amt, incentive_price)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

            const params = [
                date,
                collection_time,
                company_id,
                distributed_milk_qty,
                FAT,
                SNF,
                price_per_liter,
                total_amt,
                incentive_price
            ];

            db.run(insertQuery, params, function (err) {
                if (err) {
                    return res.status(500).json({ message: 'Failed to add milk distribution', error: err });
                }

                return res.status(201).json({
                    message: 'Milk distribution record added successfully!'
                });
            });
        }
    } catch (error) {
        console.error('Error adding milk sale record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateMilkSaleRecord = (req, res) => {
    const {
      id,
      date,
      collection_time,
      company_id,
      distributed_milk_qty,
      FAT,
      SNF,
      price_per_liter,
      total_amt,
      incentive_price
    } = req.body;
  
    const checkQuery = `
      SELECT * FROM milk_distributions 
      WHERE id = ?;
    `;
  
    db.get(checkQuery, [id], (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
  
      if (!row) {
        return res.status(404).json({
          message: `Record with ID ${id} does not exist.`
        });
      }
  
      const updateQuery = `
        UPDATE milk_distributions 
        SET 
          date = ?, 
          collection_time = ?, 
          company_id = ?, 
          distributed_milk_qty = ?, 
          FAT = ?, 
          SNF = ?, 
          price_per_liter = ?, 
          total_amt = ?, 
          incentive_price = ?
        WHERE id = ?;
      `;
  
      const params = [
        date,
        collection_time,
        company_id,
        distributed_milk_qty,
        FAT,
        SNF,
        price_per_liter,
        total_amt,
        incentive_price,
        id
      ];
  
      db.run(updateQuery, params, function (err) {
        if (err) {
          return res.status(500).json({ message: 'Failed to update milk distribution record', error: err });
        }
  
        return res.status(200).json({
          message: 'Milk distribution record updated successfully!'
        });
      });
    });
  };
  


module.exports = { getMilkCompanyPage, getAddMilkCompanyPage, getMilkSalesPage, getEditMilkCompanyPage, addCompany, updateCompany, addMilkSaleRecord, updateMilkSaleRecord };