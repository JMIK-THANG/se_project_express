const User = require("../models/user");
const bcrypt = require("bcryptjs");
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR,
  SUCCESS,
  CREATED,
  UNAUTHORIZED,
  CONFLICT,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Invalid email or password" });
  }

  // verify if the user has already been created, based on email
  // query your mongo collection for the email, if it exists throw this error
  // return res.status(CONFLICT).send({ message: "User already exist" });
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(CONFLICT).send({ message: "User already exist" });
    }
  });

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) =>
      res.status(CREATED).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      })
    )

    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Bad request: Invalid data sent" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// current User
const getCurrentUser = (req, res) => {
  const currentUser = req.user;
  User.findById(currentUser);
  User.find({})
    .then((user) => res.status(SUCCESS).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "User Not Found!" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid user ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};
const updateProfile = (req, res) => {
  const updateUser = req.user;
  const { name, avatar } = req.body;
  return User.findByIdAndUpdate(
    updateUser._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.status(SUCCESS).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "User Not Found!" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid user ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: "Incorrect email or password" });
    });
};

module.exports = { getCurrentUser, createUser, updateProfile, loginUser };
