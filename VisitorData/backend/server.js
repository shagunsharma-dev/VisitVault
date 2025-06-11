const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const visitorRoutes = require('./routes/visitorRoutes');
 
dotenv.config();
connectDB();

const app = express();
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // Allow your frontend
  credentials: true               // If you’re using cookies or auth
}));
app.use(express.json({ limit: '10mb' })); // for base64 image data

app.use('/api/visitors', visitorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
