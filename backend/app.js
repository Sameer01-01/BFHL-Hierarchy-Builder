const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const bfhlRoutes = require('./routes/bfhlRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Security & Utility Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent OOM

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        is_success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    }
});
app.use('/bfhl', limiter);

// Routes
app.use('/bfhl', bfhlRoutes);

// Health check
app.get('/', (req, res) => {
    res.status(200).json({
        is_success: true,
        message: 'BFHL API is live and healthy',
        version: '1.1.0'
    });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[SERVER] Production-ready BFHL server running on port ${PORT}`);
});

module.exports = app;
