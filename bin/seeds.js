const mongoose = require("mongoose");
const User = require("../models/users.model");
const Country = require("../models/country.model")
const Post = require("../models/post.model")

const DB_NAME = "clean-closet"; 

mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
  useCreateIndex: true,
  useNewUrlParser: true, 
  useUnifiedTopology: true,
});

const users = [
    { 
      picture: "blabla",
      username: "User One",
      name: "blabla3",
      lastName: "blabla3",
      country: "blabla3",
      password: "bla3"
      },
      { 
        picture: "blabla4",
      username: "User Two",
      name: "blabla4",
      lastName: "blabla4",
      country: "blabla4",
      password: "bla"
      },
];

const posts = [
  {
    picture: "string",
    title: "1st Post",
    country: "string",
    link: "string",
    intro: "string",
  },
  {
    picture: "string",
    title: "2nd Post",
    country: "string",
    link: "string",
    intro: "string",
  },
];

User.create(users)
      .then((usersFromDB) => {
        console.log(`added ${usersFromDB.length} users in database`);
        mongoose.connection.close();
      })
      .catch((err) =>
        console.log(`Error from User.create in seeds.js file: ${err}`));

Post.create(posts)
        .then((postsFromDB) => {
          console.log(`added ${postsFromDB.length} posts in database`);
          mongoose.connection.close();
        })
        .catch((err) =>
          console.log(`Error from Post.create in seeds.js file: ${err}`));
