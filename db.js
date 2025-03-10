const { Pool } = require('pg');

const pool = new Pool({
  user: 'panes_de_la_ruminahui_user',
  host: 'dpg-cv448ftds78s73e3m7i0-a.oregon-postgres.render.com',
  database: 'panes_de_la_ruminahui_qd9b',
  password: 'fxZVwetG2w6gIUBfYFfg37q16fbGLCac',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log('Conexión exitosa a PostgreSQL'))
  .catch(err => {
    console.error('Error al conectar a PostgreSQL:', err.message);
    console.error('Detalles:', err);
  });

module.exports = pool;