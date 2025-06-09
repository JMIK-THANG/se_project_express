const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");
const { createUser, loginUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");
const {
  validateCreateUser,
  authenticationUserInfo,
} = require("../middlewares/validation");

router.use("/users", auth, userRouter);
router.use("/items", clothingItem);

router.post("/signin", authenticationUserInfo, loginUser);
router.post("/signup", validateCreateUser, createUser);

router.use((req, res) =>
  res.status(NOT_FOUND_ERROR_CODE).send({ message: "Page Not Found" })
);
module.exports = router;
