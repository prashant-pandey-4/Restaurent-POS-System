const MenuItem = require("../models/MenuItem");

exports.getMenu = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ category: 1 });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching menu items", 
      error: error.message 
    });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { name, price, category } = req.body;
    
    if (!name || !price || !category) {
      return res.status(400).json({ 
        message: "Please provide name, price, and category." 
      });
    }

    const newItem = await MenuItem.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ 
      message: "Failed to create menu item", 
      error: error.message 
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};