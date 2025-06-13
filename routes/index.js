const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const { createUser, loginUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");
const {
  validateCreateUser,
  authenticationUserInfo,
} = require("../middlewares/validation");
const NotFoundError = require("../errors/notFoundError");

router.use("/users", auth, userRouter);
router.use("/items", clothingItem);

router.post("/signin", authenticationUserInfo, loginUser);
router.post("/signup", validateCreateUser, createUser);

router.use(() => {
  throw new NotFoundError("Page not found.");
});

module.exports = router;
