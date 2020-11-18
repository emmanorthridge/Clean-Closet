const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema(
        { 
          picture: String,
          title: String,
          country: String,
          brandsName: String,
          link: String,
          intro: String,
          //liked: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
          /* price:{ 
            type: String,
            enum: ['$', '$$', '$$$'],
            required: true } */
        },
        {
            timestamps: true,
        }
);

module.exports = model("Post", postSchema);