const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  SUCCESS,
  CREATED,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../errors/badRequestError");
const NotFoundError = require("../errors/notFoundError");
const UnauthorizedError = require("../errors/unauthorizedError");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and Password are required.");
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(CONFLICT).send({ message: "User already exist" });
      }

      return bcrypt.hash(password, 10);
    })
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
        throw new BadRequestError("Bad request: Invalid data sent");
      }

      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const currentUser = req.user;
  console.log(currentUser);
  User.findById(currentUser._id)
    .then((user) => res.status(SUCCESS).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User Not Found."));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user id."));
      }
      return res.status(INTERNAL_SERVER_ERROR).send("Error in the server.");
    });
};
const updateProfile = (req, res, next) => {
  const updateUser = req.user;
  const { name, avatar } = req.body;
  return User.findByIdAndUpdate(
    updateUser._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.status(SUCCESS).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError("Invalid profile data. Please check your input.")
        );
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User Not Found."));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid User Id."));
      }
      return next(err);
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Email or password required"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(err);
    });
};

module.exports = { getCurrentUser, createUser, updateProfile, loginUser };
