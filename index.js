const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Crear tabla si no existe
pool.query(`
  CREATE TABLE IF NOT EXISTS qweets (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// GET todos los qweets
app.get('/qweets', async (req, res) => {
  const result = await pool.query('SELECT * FROM qweets ORDER BY created_at DESC');
  res.json(result.rows);
});

// POST nuevo qweet
app.post('/qweets', async (req, res) => {
  const { content } = req.body;
  const result = await pool.query(
    'INSERT INTO qweets (content) VALUES ($1) RETURNING *',
    [content]
  );
  res.json(result.rows[0]);
});

// DELETE qweet por id
app.delete('/qweets/:id', async (req, res) => {
  const id = req.params.id;
  await pool.query('DELETE FROM qweets WHERE id = $1', [id]);
  res.sendStatus(204);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
