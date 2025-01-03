const User = require("../models/user");
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR,
  SUCCESS,
  CREATED,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCESS).send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message:"An error has occurred on the server" }));
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Bad request" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
};
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(SUCCESS).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: "User Not Found!" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid user ID" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
};
module.exports = { getUsers, createUser, getUser };
