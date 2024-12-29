// external imports

const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");
router.get("/users", getUsers);
router.get("/userId", getUser);
router.post("/", createUser);

module.exports = router;
