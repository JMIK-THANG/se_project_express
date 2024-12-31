const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({name, weather, imageUrl})
    .then((item) => {
      res.send(item);
    })
    .catch((e) => {
      if(e.name === "ValidatorError"){
        return res.status(400).send({message: e.message});
      }
      return res.status(500).send({ message: "Error from createItem", e });
    });
  };

  const getItems = (req, res) => {
    ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      console.error(e)
      res.status(500).send({ message: "Error from getItems", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl} = req.body;
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
    .then(() => res.status(204))
    .send({ })
    .catch((e) => {
      res.status(500).send({ message: "Error from deleteItem", e });
    });
};
module.exports = { createItem, getItems, updateItem, deleteItem };
