const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const menuRoutes = require("./src/routes/menuRoutes");
const orderRoutes = require("./src/routes/orderRoutes");

const app = express();

// --- Professional CORS Logic ---
const corsOptions = {
  origin: [
    "https://restaurent-pos-system-frontend.onrender.com", // Local development (Vite)
    "https://restaurent-pos-system-frontend.onrender.com" // Aapka Render frontend URL (deployment ke baad yahan daal dena)
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

app.use("/menu", menuRoutes);
app.use("/order", orderRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
