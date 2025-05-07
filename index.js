const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()

// Middleware
  app.use(express.json());
    app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })); 


const landRoutes = require('./src/land/land.route');

const orderRoutes = require('./src/orders/order.route');
const userRoutes = require('./src/users/user.route');
const adminRoutes =require('./src/stats/admin.stats')

app.use('/api/land', landRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/admin', adminRoutes);




async function main() {
  await mongoose.connect(process.env.DB_URL);
    app.get('/', (req, res) => {
    res.send('Hello from Backend!');
  });
}

main().then(() => console.log("Mongodb connect successfully!")).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})