const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./users/user.route'));
app.use('/api/lands', require('./land/land.route'));
app.use('/api/orders', require('./orders/order.route'));
app.use('/api/stats', require('./stats/admin.stats'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Sync database and start server
const PORT = process.env.PORT || 5000;

sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to sync database:', err);
}); 