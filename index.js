const express = require('express');
const pool = require('./db');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


// Obtener el stock del jugete por su ID
app.get('/toy/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM stock WHERE id_toy = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Juguete no encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al obtener el juguete');
  }
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log("se actualizoooooo")
});
