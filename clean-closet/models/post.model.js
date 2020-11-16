const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const url = "https://via.placeholder.com/150C/O https://placeholder.com/#How_To_Use_Our_Placeholders"

const postSchema = new Schema(
        { 
          picture: { type: String, default: url },
          title: String,
          country: String,
          link: String,
          intro: String,
          creator: { type: Schema.Types.ObjectId, ref: 'User' },
        },
        {
            timestamps: true,
        }
);

module.exports = model("Post", postSchema);