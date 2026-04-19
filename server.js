const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static frontend files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// ---------- API Routes ----------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tickets ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tickets', async (req, res) => {
  const { title, description, technician, priority, status, target_date, created_by, location, category } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO tickets (title, description, technician, priority, status, target_date, created_by, location, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [title, description, technician, priority, status, target_date, created_by, location, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/tickets/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await db.query('UPDATE tickets SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tickets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM tickets WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Users
app.get('/api/users', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Inventory
app.get('/api/inventory', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM inventory ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Catch‑all fallback for client‑side routing (must use `app.use`, not `app.get`)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
