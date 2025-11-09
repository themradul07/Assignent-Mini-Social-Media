require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const uploadRoutes = require('./routes/upload');

const app = express();
app.use(cors());
app.use(express.json({ limit: '12mb' }));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/3w-social';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err=> console.error('Mongo connection error', err));

app.get('/', (req, res) => {
  return res.json({
    ok :"Working well",
  })
})

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server listening on', PORT));
