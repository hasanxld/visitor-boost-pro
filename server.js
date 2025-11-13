const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const visitorRoutes = require('./routes/visitor');

const app = express();

// Custom Port System - tumi je port diba sei port e run korbe
const PORT = process.argv[2] || process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', visitorRoutes);

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server with custom port
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 VisitorBoost Pro Server running on port ${PORT}`);
    console.log(`📱 Local: http://localhost:${PORT}`);
    console.log(`🌐 Network: http://YOUR_IP:${PORT}`);
    console.log(`🔥 Real Proxy System Activated!`);
    console.log(`💡 Using port: ${PORT} - Your chosen port!`);
});

module.exports = app;
