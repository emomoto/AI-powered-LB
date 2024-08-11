const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const router = express.Router();

router.post('/upload-doc', (req, res) => {
    res.send('Document uploaded successfully.');
});

router.get('/get-doc/:id', (req, res) => {
    const { id } = req.params;
    res.send(`Document with ID ${id} retrieved successfully.`);
});

router.put('/update-doc/:id', (req, res) => {
    const { id } = req.params;
    res.send(`Document with ID ${id} updated successfully.`);
});

router.delete('/delete-doc/:id', (req, res) => {
    const { id } = req.params;
    res.send(`Document with ID ${id} deleted successfully.`);
});

router.post('/register-user', (req, res) => {
    res.send('User registered successfully.');
});

router.post('/login-user', (req, res) => {
    res.send('User logged in successfully.');
});

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});