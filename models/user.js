const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  avatar: {
    type: "String",
    required: [true, "The avatar field is require,"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
});

module.experts = mongoose.model("user", userSchema);