const ClothingItem = require("../models/clothingItem");
const { SUCCESS } = require("../utils/errors");
const BadRequestError = require("../errors/badRequestError");
const ForbiddenError = require("../errors/forbiddenError");
const NotFoundError = require("../errors/notFoundError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Request validation fail."));
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(SUCCESS).send(items))
    .catch((err) => {
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const owner = req.user._id;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== owner) {
        return next(
          new ForbiddenError(
            "Cannot delete item. Only the owner can perform this action."
          )
        );
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: " Item deleted." }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BadRequestError(
            "Invalid delete request. Please check the item ID or data."
          )
        );
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found."));
      }
      return next(err);
    });
};
const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(SUCCESS).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Bad request. Item ID is not valid."));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Like failed. The item does not exist"));
      }
      return next(err);
    });
};

const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(SUCCESS).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BadRequestError("Bad request. Invalid item ID for unlike action")
        );
      }
      if (err.name === "DocumentNotFoundError") {
        return next(
          new NotFoundError("The item you're trying to unlike was not found.")
        );
      }
      return next(err);
    });
};
module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
