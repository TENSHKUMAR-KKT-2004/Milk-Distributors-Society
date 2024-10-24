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
            
            db.all("SELECT * FROM milk_distributions", [], (err, sales_record) => {
                if (err) {
                    return res.status(500).send('Error fetching sales records');
                }

                const combinedRecords = sales_record.reduce((acc, record) => {
                    const key = `${record.date}-${record.company_id}`;
                    if (!acc[key]) {
                        acc[key] = {
                            date: record.date,
                            company_id: record.company_id,
                            morning_qty: 0,
                            evening_qty: 0,
                            total_qty: 0,
                            total_amt: 0,
                            morning_price_per_liter:0,
                            evening_price_per_liter:0,
                            morning_total_price:0,
                            evening_total_price:0,
                            price_per_liter: record.price_per_liter,
                        };
                    }
                    if (record.collection_time === 'morning') {
                        acc[key].morning_qty += record.distributed_milk_qty;
                        acc[key].total_amt += record.total_amt;
                        acc[key].morning_price_per_liter += record.price_per_liter;
                        acc[key].morning_total_price += record.total_amt;
                    } else {
                        acc[key].evening_qty += record.distributed_milk_qty;
                        acc[key].total_amt += record.total_amt;
                        acc[key].evening_price_per_liter += record.price_per_liter;
                        acc[key].evening_total_price += record.total_amt;
                    }
                    acc[key].total_qty = acc[key].morning_qty + acc[key].evening_qty;
                    return acc;
                }, {});

                const result = Object.values(combinedRecords);

                res.render('milk-sales', { companies, sales_record: result });
            });
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
                SELECT collection_time FROM milk_distributions 
                WHERE date = ? AND company_id = ?;
            `;

            db.all(query, [date, company_id], (err, rows) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error', error: err });
                }

                const existingTimes = rows.map(row => row.collection_time);
                if (existingTimes.includes(collection_time)) {
                    return res.status(400).json({
                        message: `Record already exists for ${company_id} on ${date} during ${collection_time}.`
                    });
                }

                if (existingTimes.length >= 2) {
                    return res.status(400).json({
                        message: `Cannot add more than one morning and one evening record for ${company_id} on ${date}.`
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