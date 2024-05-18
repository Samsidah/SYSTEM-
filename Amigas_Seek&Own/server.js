const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());  // Add this line to enable CORS
app.use(express.json());
app.use(express.static(__dirname));

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    port: 3306,
    database: 'real_estate'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/properties', (req, res) => {
    connection.query('SELECT * FROM property', (error, results, fields) => {
        if (error) {
            console.error('Error retrieving properties: ' + error.stack);
            res.status(500).send('Error retrieving properties from the database');
            return;
        }
        res.json(results);
    });
});

app.post('/properties', (req, res) => {
    const { name, price, location } = req.body;
    connection.query('INSERT INTO property (PropertyName, PropertyPrice, PropertyLocation) VALUES (?, ?, ?)', [name, price, location], (error, results, fields) => {
        if (error) {
            console.error('Error adding property: ' + error.stack);
            return res.status(500).send('Error adding property to the database');
        }
        res.sendStatus(201);
    });
});

app.delete('/properties/:id', (req, res) => {
    const propertyId = req.params.id;
    connection.query('DELETE FROM property WHERE ID = ?', [propertyId], (error, results, fields) => {
        if (error) {
            console.error('Error deleting property:', error.stack);
            return res.status(500).send('Error deleting property from the database');
        }
        res.sendStatus(200);
    });
});

app.put('/properties/:id', (req, res) => {
    const propertyId = req.params.id;
    const { name, price, location } = req.body;
    connection.query('UPDATE property SET PropertyName = ?, PropertyPrice = ?, PropertyLocation = ? WHERE ID = ?', [name, price, location, propertyId], (error, results, fields) => {
        if (error) {
            console.error('Error updating property:', error.stack);
            return res.status(500).send('Error updating property details in the database');
        }
        connection.query('SELECT * FROM property WHERE ID = ?', [propertyId], (error, results, fields) => {
            if (error) {
                console.error('Error retrieving updated property:', error.stack);
                return res.status(500).send('Error retrieving updated property from the database');
            }
            if (results.length === 0) {
                return res.status(404).send('Updated property not found in the database');
            }
            res.json(results[0]);
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
