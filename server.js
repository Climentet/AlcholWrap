const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ruta para obtener los contadores totales
app.get('/contadores.json', (req, res) => {
    fs.readFile('./public/contadores.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ mensaje: 'Error al leer los contadores' });
        }
        res.json(JSON.parse(data));
    });
});

// Ruta para actualizar los contadores totales
app.post('/actualizar-contadores', (req, res) => {
    const nuevosDatos = req.body;

    // Leer el archivo actual
    fs.readFile('./public/contadores.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ mensaje: 'Error al leer los contadores' });
        }

        let contadores = JSON.parse(data);

        // Sumar los valores nuevos a los valores existentes
        Object.keys(nuevosDatos).forEach(usuario => {
            if (!contadores[usuario]) {
                contadores[usuario] = { kubats: 0, xupits: 0, rubias: 0, vinos: 0 };
            }

            // Actualizar los valores
            contadores[usuario].kubats += nuevosDatos[usuario].kubats || 0;
            contadores[usuario].xupits += nuevosDatos[usuario].xupits || 0;
            contadores[usuario].rubias += nuevosDatos[usuario].rubias || 0;
            contadores[usuario].vinos += nuevosDatos[usuario].vinos || 0;
        });

        // Guardar los datos actualizados en el archivo
        fs.writeFile('./public/contadores.json', JSON.stringify(contadores, null, 2), err => {
            if (err) {
                console.error('Error al guardar los contadores:', err);
                return res.status(500).json({ mensaje: 'Error al guardar los contadores' });
            }
            res.json({ mensaje: 'Contadores actualizados correctamente', contadores });
        });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
