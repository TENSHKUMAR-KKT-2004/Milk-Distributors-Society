const db = require('../config/db')

const getFeeds = async (req, res) => {
  try {
    db.all("SELECT * FROM cattle_feeds", [], (err, feeds) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Error fetching cattle feed product ");
        return;
      }
      res.render('feeds', { feeds });

    })
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
};

const getAddFeedPage = async (req, res) => {
  res.render('feed-add');
};

const getEditFeedPage = async (req, res) => {
  try {
    db.all("SELECT * FROM cattle_feeds", [], (err, feeds) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Error fetching cattle feed product ");
        return;
      }
      res.render('feed-edit', { feeds });

    })
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
};

const getFeedSalesPage = async (req, res) => {
  try {
    db.all("SELECT * FROM cattle_feeds", [], (err, feeds) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Error fetching cattle feed product ");
        return;
      }
      db.all("SELECT * FROM milk_producers WHERE is_active = 1", [], (err, producers) => {
        if (err) {
          console.error(err.message);
          res.status(500).send("Error fetching cattle feed product ");
          return;
        }
        db.all("SELECT * FROM cattle_feed_sales", [], (err, sales_records) => {
          if (err) {
            console.error(err.message);
            res.status(500).send("Error fetching cattle feed product ");
            return;
          }
          res.render('feed-sales', { feeds, producers, sales_records });
        })
      })
    })
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
}

const getFeedPurchasePage = async (req, res) => {
  try {
    db.all("SELECT * FROM cattle_feeds", [], (err, feeds) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Error fetching cattle feed product ");
        return;
      }

      db.all(
        `
          SELECT p.*, f.name as feed_name
          FROM cattle_feed_purchase p
          JOIN cattle_feeds f ON p.feed_id = f.id
        `,
        [],
        (err, purchases) => {
          if (err) {
            console.error(err.message);
            res.status(500).send("Error fetching cattle feed purchase records");
            return;
          }

          res.render('feed-purchase', { feeds, purchases });
        }
      )
    })
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
}

const addNewFeedProduct = async (req, res) => {
  const { name, cost_price, selling_price, stock_quantity } = req.body

  try {
    if (!name || !cost_price || !selling_price || !stock_quantity) {
      return res.status(400).json({ message: 'All details are required.' });
    }

    const query = `
      INSERT INTO cattle_feeds ( name, cost_price, selling_price, stock_quantity )
      VALUES (?, ?, ?, ?)
    `;

    db.run(query, [name, cost_price, selling_price, stock_quantity], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Could not add cattle feed product', error: err.message });
      }

      res.status(201).json({ message: 'Cattle feed product added successfully', id: this.lastID });
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
}

const updateFeedProduct = async (req, res) => {
  const { id, name, cost_price, selling_price, stock_quantity } = req.body;

  try {
    const query = `
    UPDATE cattle_feeds
    SET name = ?, cost_price = ?, selling_price = ?, stock_quantity = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

    db.run(query, [name, cost_price, selling_price, stock_quantity, id], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating producer details' });
      }
      res.status(201).json({ message: 'Cattle feed product details updated successfully!' });
    });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
}

const addFeedPurchase = async (req, res) => {
  const { date, company_name, feed_id, cost_price, purchase_quantity, total_price, invoice_no, sales_price } = req.body;

  if (!date || !feed_id || !cost_price || !purchase_quantity || !total_price || !sales_price) {
    return res.status(400).send("All fields are required.");
  }

  try {
    const getStockQuery = 'SELECT stock_quantity FROM cattle_feeds WHERE id = ?';
    db.get(getStockQuery, [feed_id], (err, row) => {
      if (err) {
        console.error("Error fetching feed stock:", err.message);
        return res.status(500).send("Failed to fetch feed stock.");
      }

      if (!row) {
        return res.status(404).send("Feed not found.");
      }

      const currentStock = row.stock_quantity;
      const updatedStock = currentStock + parseInt(purchase_quantity, 10);

      const insertQuery = `
        INSERT INTO cattle_feed_purchase (purchase_date, company_name, feed_id, quantity, cost_price, total_price, invoice_number, sales_price, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;
      const params = [date, company_name, feed_id, purchase_quantity, cost_price, total_price, invoice_no, sales_price];

      db.run(insertQuery, params, function (err) {
        if (err) {
          console.error("Error inserting feed purchase:", err.message);
          return res.status(500).send("Failed to add feed purchase record.");
        }

        const updateStockQuery = 'UPDATE cattle_feeds SET stock_quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        db.run(updateStockQuery, [updatedStock, feed_id], function (err) {
          if (err) {
            console.error("Error updating feed stock:", err.message);
            return res.status(500).send("Failed to update feed stock.");
          }

          res.status(201).json({ message: 'Cattle feed product purchase record added successfully' });
        });
      });
    });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).send("Internal Server Error.");
  }
};

const updateFeedPurchase = async (req, res) => {
  const { id, company_name, purchase_date, feed_id, cost_price, quantity, total_price, invoice_no, sales_price } = req.body;

  try {
    const getPurchaseQuery = 'SELECT quantity FROM cattle_feed_purchase WHERE id = ?';
    db.get(getPurchaseQuery, [id], (err, purchaseRow) => {
      if (err) {
        console.error('Error fetching existing purchase:', err.message);
        return res.status(500).send('Failed to fetch purchase data.');
      }

      if (!purchaseRow) {
        return res.status(404).send('Purchase record not found.');
      }

      const existingPurchaseQuantity = purchaseRow.quantity;

      const getStockQuery = 'SELECT stock_quantity FROM cattle_feeds WHERE id = ?';
      db.get(getStockQuery, [feed_id], (err, stockRow) => {
        if (err) {
          console.error('Error fetching feed stock:', err.message);
          return res.status(500).send('Failed to fetch feed stock.');
        }

        if (!stockRow) {
          return res.status(404).send('Feed not found.');
        }

        const currentStock = stockRow.stock_quantity;
        let updatedStock;

        if (quantity > existingPurchaseQuantity) {
          updatedStock = currentStock + (quantity - existingPurchaseQuantity);
        } else {
          updatedStock = currentStock - (existingPurchaseQuantity - quantity);
        }

        const updateQuery = `
          UPDATE cattle_feed_purchase
          SET purchase_date = ?, company_name = ?, feed_id = ?, quantity = ?, cost_price = ?, total_price = ?, invoice_number = ?, sales_price = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `;
        db.run(updateQuery, [purchase_date, company_name, feed_id, quantity, cost_price, total_price, invoice_no, sales_price, id], function (err) {
          if (err) {
            return res.status(500).json({ message: 'Error updating feed purchase record' });
          }

          const updateStockQuery = 'UPDATE cattle_feeds SET stock_quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
          db.run(updateStockQuery, [updatedStock, feed_id], function (err) {
            if (err) {
              console.error('Error updating feed stock:', err.message);
              return res.status(500).send('Failed to update feed stock.');
            }

            res.status(201).json({ message: 'Cattle feed product details updated successfully!' });
          });
        });
      });
    });
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).send('Internal Server Error');
  }
}

const addFeedSales = async (req, res) => {
    const { milk_producer_id, payment_mode, sales_date, feed_id, quantity, sales_price, total_price } = req.body;
    const sql = `INSERT INTO cattle_feed_sales (milk_producer_id, payment_mode, sales_date, feed_id, quantity, sales_price, total_price) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const params = [milk_producer_id, payment_mode, sales_date, feed_id, quantity, sales_price, total_price];

    try {
        db.run(sql, params, function (err) {
            if (err) {
              console.error('Error adding feed sales record:', err.message);
              return res.status(500).send('Failed to adding feed sales record.');
            }

            res.status(201).json({ message: 'Cattle feed sales record added successfully!' });
          });
    } catch (error) {
        res.status(500).json({ message: "Failed to create feed sale record" });
    }
};

// // Fetch all feed sales records
// exports.getFeedSales = async (req, res) => {
//     try {
//         const result = await db.query('SELECT * FROM cattle_feed_sales');
//         res.status(200).json(result.rows);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to retrieve feed sales" });
//     }
// };

// // Update feed sale record
// exports.updateFeedSale = async (req, res) => {
//     const { id } = req.params;
//     const { milk_producer_id, payment_mode, sales_date, feed_id, quantity, sales_price, total_price } = req.body;

//     try {
//         const result = await db.query(
//             `UPDATE cattle_feed_sales 
//              SET milk_producer_id = $1, payment_mode = $2, sales_date = $3, feed_id = $4, quantity = $5, sales_price = $6, total_price = $7, updated_at = NOW() 
//              WHERE id = $8 RETURNING *`,
//             [milk_producer_id, payment_mode, sales_date, feed_id, quantity, sales_price, total_price, id]
//         );
//         res.status(200).json(result.rows[0]);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to update feed sale record" });
//     }
// };


module.exports = { getFeeds, getAddFeedPage, getEditFeedPage, getFeedSalesPage, getFeedPurchasePage, addNewFeedProduct, updateFeedProduct, addFeedPurchase, updateFeedPurchase, addFeedSales };