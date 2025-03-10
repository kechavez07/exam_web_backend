const express = require('express');
const pool = require('./db');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

//users

//Buscar por usuario y contraseña 
app.post('/users/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT username FROM users WHERE username = $1 AND password = $2;',
      [username, password]
    );

    if (result.rows.length > 0) {
      res.json({ message: 'Inicio de sesión exitoso', user: result.rows[0] });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }

  } catch (error) {
    console.error('Error en la consulta', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



// Obtener todos los usuarios
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT users.id_user, users.username, users.id_rol, rol.name AS role_name FROM users JOIN rol ON users.id_rol = rol.id_rol'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al obtener los usuarios');
  }
});

// Obtener un usuario por su ID
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT users.id_user, users.username, users.id_rol, rol.name AS role_name FROM users JOIN rol ON users.id_rol = rol.id_rol WHERE users.id_user = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al obtener el usuario');
  }
});

// Crear un nuevo usuario
app.post('/users', async (req, res) => {
  try {
    const { username, password, id_rol } = req.body;

    const result = await pool.query(
      'INSERT INTO users (username, password, id_rol) VALUES ($1, $2, $3) RETURNING *',
      [username, password, id_rol]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al crear el usuario');
  }
});

// Actualizar un usuario por su ID
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, id_rol } = req.body;

    const result = await pool.query(
      'UPDATE users SET username = $2, password = $3, id_rol = $4 WHERE id_user = $1 RETURNING *',
      [id, username, password, id_rol]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al actualizar el usuario');
  }
});

// Eliminar un usuario por su ID
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM users WHERE id_user = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al eliminar el usuario');
  }
});




app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log("se actualizoooooo")
});
