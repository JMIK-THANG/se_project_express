const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");

const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res) =>
  res.status(NOT_FOUND_ERROR_CODE).send({ message: "Page Not Found" })
);
module.exports = router;
