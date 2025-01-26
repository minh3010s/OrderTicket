const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const users=require('../Server/routes/userRoute')
const places=require('../Server/routes/placeRoute')
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
// Connect to database
mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to the database'));

//Use cors
app.use(cors());

// Middleware
app.use(express.urlencoded({ extended: true })); // Required for form submissions
app.use(express.json()); // Required for JSON payloads

// Use routes
app.use('/api', users);
app.use('/api',places)

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port:http://localhost:${PORT}`);
});
