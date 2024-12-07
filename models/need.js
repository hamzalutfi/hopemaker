const mongoose = require("mongoose");

const needSchema = new mongoose.Schema({
    address:{
        type: String,
        required: false,
    },
  title: {
    type: String,
    required: true,
  },
  describtion: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  img: {
    type: String,
    required: false,
  },
  userDisabled: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  userDoner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});
const needs = mongoose.model("need", needSchema);
module.exports = needs;
