const User = require("../models/user");
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};
const getUser = (req, res) => {
  const { userId } = req.param;
  User.findById(userId).orFail()
  .then((user) => res.status(201).send(user)).catch((err) => {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
    } else {
      if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Invalid user ID" });
      }
    }
    return res.status(500).send({ message: err.message });
  });
};
module.exports = { getUsers, createUser, getUser };



