const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Get all stock items
app.get('/stock', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM stock');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new stock item
app.post('/stock', async (req, res) => {
    const { name, unit, price, threshold } = req.body;
    try {
        await pool.query('INSERT INTO stock (name, unit, price, threshold) VALUES ($1, $2, $3, $4)', 
        [name, unit, price, threshold]);
        res.status(201).json({ message: 'Stock item added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Record a stock transaction
app.post('/transactions', async (req, res) => {
    const { stock_id, date, quantity, type } = req.body;
    try {
        await pool.query('INSERT INTO transactions (stock_id, date, quantity, type) VALUES ($1, $2, $3, $4)', 
        [stock_id, date, quantity, type]);
        res.status(201).json({ message: 'Transaction recorded successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get stock usage between dates
app.get('/usage', async (req, res) => {
    const { start_date, end_date } = req.query;
    try {
        const result = await pool.query(
            "SELECT stock_id, SUM(quantity) as total_used FROM transactions WHERE date BETWEEN $1 AND $2 AND type = 'subtraction' GROUP BY stock_id", 
            [start_date, end_date]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
