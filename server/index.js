const express = require('express');
const mariadb = require('mariadb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'mysecretpassword',
  database: process.env.DB_NAME || 'productos',
});

// Establecer la conexión al iniciar el servidor
pool.getConnection()
.then(async connection => {
  console.log('Conexión a la base de datos establecida');
  await createTable()
  connection.release();
})
.catch(error => {
  console.error('Error al conectar a la base de datos:', error);
});

async function createTable () {
	const sql = `
		CREATE TABLE IF NOT EXISTS productos (
			id INT NOT NULL AUTO_INCREMENT,
			nombre VARCHAR(100) NOT NULL,
			precio FLOAT NOT NULL,
			PRIMARY KEY (id)
		)
	`

	return await pool.query(sql)
};

//Rura get
app.get('/productos',async (_req, res) => {
	let conn;
	
	try {
		conn = await pool.getConnection();
		const rows = await conn.query('SELECT * FROM productos.productos');
		res.json(rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Error al obtener los productos' });
	} finally {
		if (conn) conn.release();
	}
});

//Ruta post
app.post('/productos', async(req, res) => {
  const { nombre, precio } = req.body;

  if (!nombre || !precio) {
    res.status(400).json({ error: 'El nombre y el precio son obligatorios' });
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('INSERT INTO productos.productos (nombre, precio) VALUES (?, ?)', [nombre, precio]);
    res.status(201).json({ message: 'Producto creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el producto' });
  } finally {
    if (conn) conn.release();
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
