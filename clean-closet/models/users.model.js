const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const url = "https://via.placeholder.com/150C/O https://placeholder.com/#How_To_Use_Our_Placeholders"

const userSchema = new Schema(
        { 
          picture: String,
          username: {
            type: String,
            unique: true,
            required: [true, '❌ Username is required.'],
            },
          //likes: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
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