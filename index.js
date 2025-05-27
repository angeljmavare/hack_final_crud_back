const express = require('express');
const app = express();
const { Pool } = require('pg');
const cors = require('cors');
const port = process.env.PORT || 3001;

app.use(cors({ origin: "*" }));

app.use(express.json());

const db = new Pool({
    host: 'db-crud-final.cj2cywk4i2hh.us-east-1.rds.amazonaws.com',
    user: 'postgres',
    password: 'postgres',
    database: 'crud_usuarios_final',
    port: 5432,
    ssl: { // Habilitar SSL para que se establezca la conexión segura con la base de datos
         rejectUnauthorized: false
    }
  });

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos establecida');

    // Crear tabla si no existe
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            edad INT NOT NULL,
            correo VARCHAR(100) UNIQUE NOT NULL
        );
    `;

    db.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Error al crear la tabla:', err);
        } else {
            console.log('Tabla "usuarios" verificada o creada correctamente.');
        }
    });
});  

app.post('/create', (req, res) => {
    const { nombre, edad, correo } = req.body;
    db.query('INSERT INTO usuarios (nombre, edad, correo) VALUES ($1, $2, $3)', [nombre, edad, correo],
        (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});


app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});

app.put('/update', (req, res) => {
    const { id, nombre, edad, correo } = req.body;

    db.query('UPDATE usuarios SET nombre = $2, edad = $3, correo = $4 WHERE id = $1', [id, nombre, edad, correo],
        (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM usuarios WHERE id = $1', [id],
        (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});