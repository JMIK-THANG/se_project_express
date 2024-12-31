const mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: [2, 'The minimum length of the "name" field is 2'],
    maxlength: [30, 'The maximum length of the "name" field is 30'],
  },
  weather: {
    type: String,
    required: true,
    minlength: [2, 'The minimum length of the "name" field is 2'],
    maxlength: [30, 'The maximum length of the "name" field is 30'],
  },
  imageUrl: {
    type: String,
    required: true,
    minlength: [2, 'The minimum length of the "name" field is 2'],
    maxlength: [30, 'The maximum length of the "name" field is 30'],

    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not Valid",
    },
  },
});

module.exports = mongoose.model("clothingItems", clothingItem);
