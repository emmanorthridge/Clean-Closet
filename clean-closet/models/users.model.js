const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
        { 
          //DEFAULT PIC
          picture: String,
          username: { type: String, unique: true},
          name: String,
          lastName: String,
          country: String,
          posts:{ type: [String] },
        },
        {
            timestamps: true,
        }
);

module.exports = model("User", userSchema);