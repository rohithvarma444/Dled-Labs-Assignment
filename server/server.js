const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT =3000;

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.options('*', cors(corsOptions));

app.use(cors(corsOptions));

app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
connectDB();

app.get('/', (req, res) => {
  res.send('Welcome to the Dled Labs Assignment API');
});
app.use('/api', require('./routes/api'));

app.listen(3000, () => {
  console.log(`Server is running on port ${PORT}`);
});
