const router = require("express").Router();
const {auth} = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.post("/", auth, createItem);

router.get("/", getItems);

router.delete("/:itemId",auth,  deleteItem);

router.put("/:itemId/likes", auth, likeItem);

router.delete("/:itemId/likes", auth,  unlikeItem);

module.exports = router;
