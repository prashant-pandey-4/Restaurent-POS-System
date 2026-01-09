const express = require("express");
const router = express.Router();

const MenuController = require("../controllers/MenuController");


router
  .route("/")
  .get(MenuController.getMenu)
  .post(MenuController.addItem); 
router.post("/add", MenuController.addItem); 
router.put("/update/:id", MenuController.updateItem); 
router.delete("/delete/:id", MenuController.deleteItem); 

module.exports = router;