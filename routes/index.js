const router = require("express").Router();
const userRouter = require("./users"); // is this user.js from routes? believe it's in the current directory
const clothingItem = require("./clothingItems");// same directory ?
const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");
const { createUser, loginUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");

// Q how this work.
router.use("/users", auth, userRouter);
router.use("/items", clothingItem);

router.post("/signin", loginUser);
router.post("/signup", createUser);

router.use((req, res) =>
  res.status(NOT_FOUND_ERROR_CODE).send({ message: "Page Not Found" })
);
module.exports = router;
