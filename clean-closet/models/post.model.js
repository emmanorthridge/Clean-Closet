const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema(
        { 
          picture: String,
          title: String,
          country: String,
          brandsName: String,
          link: String,
          intro: String
        },
        {
            timestamps: true,
        }
);

module.exports = model("Post", postSchema);