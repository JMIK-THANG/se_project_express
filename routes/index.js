const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");

const { BAD_REQUEST_ERROR_CODE } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res) => {
  return res.status(BAD_REQUEST_ERROR_CODE).send("Page not found.");
});
module.exports = router;
