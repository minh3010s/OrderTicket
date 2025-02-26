const express = require('express');
require('dotenv').config();
const users=require('../Server/routes/userRoute')
const places=require('../Server/routes/placeRoute')
const schedule=require('../Server/routes/scheduleRoute')
const path=require('path')
const authRouter=require('../Server/routes/auth.routes')
const transport=require('../Server/routes/transportRoute')
const connectToDatabase=require('../Server/database/mongodb')
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
// Connect to database

//Use cors
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
// Middleware
app.use(express.urlencoded({ extended: true })); // Required for form submissions
app.use(express.json()); // Required for JSON payloads
// Use routes
app.use('/api', users);
app.use('/api',places);
app.use('/api',transport);
app.use('/api',schedule)
app.use("/api", authRouter);
// Start server
app.listen(PORT, async() => {
    console.log(`Server listening on port:http://localhost:${PORT}`);
    await connectToDatabase()
});
