const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem
} = require("../controllers/clothingItems");

// Create
router.post("/", createItem);

// Read
// These are endpoints..
// What is an API endpoint? 
router.get("/", getItems);

// Delete
router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", unlikeItem);

module.exports = router;
