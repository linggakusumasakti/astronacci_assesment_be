const mongoose = require('mongoose');
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();


app.use(express.json());

const authRoutes = require('./routes/auth');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api/auth', authRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(result => {
    app.listen(3636, () => {
      console.log(`Server running`);
    });
  })
  .catch(err => console.log(err));