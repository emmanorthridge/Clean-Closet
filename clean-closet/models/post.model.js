const mongoose = require("mongoose");
const { Schema, model } = mongoose;
//const url = "https://via.placeholder.com/150C/O https://placeholder.com/#How_To_Use_Our_Placeholders"

const postSchema = new Schema(
        { 
          picture: { type: String, default: ("../public/images/paper-bag.png") },
          title: String,
          country: String,
          link: String,
          intro: String,
          //liked: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
          author: { type: Schema.Types.ObjectId, ref: 'User' },
          price: { type: [String], enum: ['$', '$$', '$$$'], required: true }
        },
        {
            timestamps: true,
        }
);

module.exports = model("Post", postSchema);