const mongoose = require("mongoose");
const User = require("../models/users.model");

const DB_NAME = "clean-closet"; 

mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
  useCreateIndex: true,
  useNewUrlParser: true, 
  useUnifiedTopology: true,
});

const users = [
    { 
        picture: 'bla1',
        username: "username1",
        name: "User1",
        lastName: "UserLastname1",
        country: "England",
        posts:[" ", " "],
      },
      { 
        picture: 'bla2',
        username: "username2",
        name: "User2",
        lastName: "UserLastname2",
        country: "France",
        posts:[" ", " "],
      },
];

User.create(users)
      .then((usersFromDB) => {
        mongoose.connection.close();
      })
      .catch((err) =>
        console.log(`Error from User.create in seeds.js file: ${err}`));
