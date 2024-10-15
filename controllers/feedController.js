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
  res.render('feed-sales');
};

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
};

module.exports = { getFeeds, getAddFeedPage, getEditFeedPage, getFeedSalesPage, getFeedPurchasePage, addNewFeedProduct, updateFeedProduct, addFeedPurchase, updateFeedPurchase };