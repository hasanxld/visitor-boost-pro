const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const visitorRoutes = require('./routes/visitor');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Start server
app.listen(PORT, () => {
    console.log(`🚀 VisitorBoost Pro Server running on port ${PORT}`);
    console.log(`📱 Access via: http://localhost:${PORT}`);
});

module.exports = app;
