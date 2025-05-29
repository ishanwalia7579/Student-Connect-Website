const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { pool } = require('./config/database');
const resourcesRouter = require('./api/resources');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    try {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('Created uploads directory');
    } catch (error) {
        console.error('Error creating uploads directory:', error);
        process.exit(1);
    }
}

// Make sure uploads directory is writable
try {
    fs.accessSync(uploadsDir, fs.constants.W_OK);
    console.log('Uploads directory is writable');
} catch (error) {
    console.error('Uploads directory is not writable:', error);
    process.exit(1);
}

// Routes
app.use('/api/resources', resourcesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong: ' + err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Closing database connection...');
    await pool.end();
    process.exit(0);
}); 