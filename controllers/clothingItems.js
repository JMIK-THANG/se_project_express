const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR,
  SUCCESS,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl, likes } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner, likes })
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Bad Request"});
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "Error from createItem" });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(SUCCESS).send(items))
    .catch((e) => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from getItems"});
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(SUCCESS).send({ message: "Item deleted" }))
    .catch((e) => {
      if (e.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Error form delete items, Bad request." });
      }
      if (e.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Error form delete items, Page Not Found!." });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from deleteItem" });
    });
};
const likeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(SUCCESS).send(item))
    .catch((e) => {
      if (e.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Error form like items, Bad request." });
      }
      if (e.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Error form like items, Page Not Found!." });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from like Items" });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(SUCCESS).send(item))
    .catch((e) => {
      if (e.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Error form unlike items, Bad request." });
      }
      if (e.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Error form unlike items, Page Not Found!." });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Error from unlike Items" });
    });
};
module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
