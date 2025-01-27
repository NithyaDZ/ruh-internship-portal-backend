const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const instructionRoutes = require('./routes/instructionRoutes');
const internshipRoutes = require('./routes/internshipRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/instructions', instructionRoutes);
app.use('/api/internships', internshipRoutes);

// Database sync and server start
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.sync();
    console.log('Database synchronized successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();