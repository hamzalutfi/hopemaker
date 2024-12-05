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
    }
})
module.exports = need;