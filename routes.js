const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.post('/upload-doc', (req, res) => {
    res.send('Document uploaded successfully.');
});

app.get('/get-doc/:id', (req, res) => {
    const { id } = req.params;
    res.send(`Document with ID ${id} retrieved successfully.`);
});

app.put('/update-doc/:id', (req, res) => {
    const { id } = req.params;
    res.send(`Document with ID ${id} updated successfully.`);
});

app.delete('/delete-doc/:id', (req, res) => {
    const { id } = req.params;
    res.send(`Document with ID ${id} deleted successfully.`);
});

app.post('/register-user', (req, res) => {
    res.send('User registered successfully.');
});

app.post('/login-user', (req, res) => {
    res.send('User logged in successfully.');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});