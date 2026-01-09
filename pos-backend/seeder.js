const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");

const MenuModel = require("./src/models/MenuItem");

const menuItems = JSON.parse(
  fs.readFileSync(`${__dirname}/data/menuItems.json`, "utf-8")
);

dotenv.config({ path: "./.env" });

const connectDB = async () => {
  try {
   
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

connectDB();
const importData = async () => {
  try {
    
    await MenuModel.deleteMany();
    
    await MenuModel.insertMany(menuItems);

    console.log("Data Imported Successfully! 🚀");
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

// Data Destroy Function
const destroyData = async () => {
  try {
    await MenuModel.deleteMany();
    console.log("Data Destroyed Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error with data destroy: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
