const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
        { 
          picture: String,
          username: {
            type: String,
            unique: true,
            required: [true, '❌ Username is required.'],
            },
          name: String,
          lastName: String,
          country: String,
          posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
          password: {
            type: String,
            required: [true, '❌ Password is required.']
          }
        },
        {
            timestamps: true,   
        }
);

module.exports = model("User", userSchema);