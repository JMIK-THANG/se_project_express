const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl, likes } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner, likes })
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: "Error from createItem", err });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: "Error from getItems", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;
  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res.status(500).send({ message: "Error from updateItem", e });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).send({ message: "Item deleted" }))
    .catch((e) => {
      if (e.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Error form like items, Bad request." });
      }
      res.status(404).send({ message: "Error from deleteItem", e });
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
    .then((item) => res.status(200).send(item))
    .catch((e) => {
      if (e.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Error form like items, Bad request." });
      }
      if (e.name === "DocumentNotFoundError") {
        return res
          .status(404)
          .send({ message: "Error form like items, Bad request." });
      }
      return res.status(500).send({ message: "Error from like Items", e });
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
    .then((item) => res.status(200).send(item))
    .catch((e) => {
      if (e.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Error form unlike items, Bad request." });
      }
      return res.status(404).send({ message: "Error from unlike Items", e });
    });
};
module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
