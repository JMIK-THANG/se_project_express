const mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'The minimum length of the "name" field is 2'],
    maxlength: [30, 'The maximum length of the "name" field is 30'],
  },
  weather: {
    type: String,
    required: true,
    minlength: [2, 'The minimum length of the "weather" field is 2'],
    maxlength: [30, 'The maximum length of the "weather" field is 30'],
  },
  imageUrl: {
    type: String,
    required: true,
    minlength: [2, 'The minimum length of the "imageUrl" field is 2'],
    maxlength: [30, 'The maximum length of the "imageUrl" field is 30'],

    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not Valid",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],

    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItem", clothingItem);
