const mongoose = require("mongoose");

const needSchema = new mongoose.Schema({
    describtion: {
        type: String,
        required: false,
    },
    statuss:{
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    img:{
        type: String,
        required: false,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }

})
const needs= mongoose.model("need", needSchema);
module.exports = needs;