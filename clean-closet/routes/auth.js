const { Router } = require("express");
const router = new Router();
const User = require("../models/users.model");
const Post = require("../models/post.model");
const bcryptjs = require("bcryptjs");
const fileUploader = require("../configs/cloudinary.config");

router.get("/signup", (req, res) => res.render("auth/signup"));

const saltRounds = 10;

router.post("/signup", fileUploader.single("image"), (req, res, next) => {
  //console.log('SESSION =====> ', req.session);

  const { username, password, name, lastName, country } = req.body;

  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username and password.",
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  let image;

  if (req.file !== undefined) {
    image = req.file.path;
  } else {
    image = "/images/user.png";
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        name,
        lastName,
        country,
        password: hashedPassword,
        picture: image
      });
    })
    .then((userFromDB) => {
      //console.log("Newly created user is: ", userFromDB);
      req.session.currentUser = userFromDB;
      res.redirect("/userProfile");
    })
    .catch((error) => {
      if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username needs to be unique. Username is already used.",
        });
      } else {
        next(error);
      }
    });
});

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);

  const { username, password } = req.body;
  if (!username || !password) {
    res.render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide your username and password.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Username is not registered. Try with other username.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

router.get("/userProfile", (req, res) => {
  User.findById(req.session.currentUser._id)
    .populate("posts")
    .then((userInSession) => {
      console.log(userInSession);
      console.log(req.session.currentUser);
      res.render("auth/profile", { userInSession });
    })
    .catch((err) =>
      console.log("❗️ could not render the profile page with you user's posts")
    );
});

/* router.get("/auth/:id/edit-profile", (req, res) =>{
  const { id } = req.params;

  User.findById(id)
  .then((userEdit) => {
    res.render("/edit-profile", userEdit);
  })
  .catch((err) => console.log(err));
}); */

router.get("/posts", (req, res, next) => {
  Post.find({})
    .populate("author")
    .then((postsFromDB) => {
      res.render("posts/post-list", { posts: postsFromDB });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/create-post", (req, res) => {
  res.render("posts/create-post");
});

router.post("/create-post", fileUploader.single("image"), (req, res) => {
  const { title, country, link, intro } = req.body;
  //console.log(req.file)
  let image;

  if (req.file !== undefined) {
    image = req.file.path;
  } else {
    image = "/images/paper-bag.png";
  }
  Post.create({ title, country, link, intro, picture: image })
    .then((dbPost) => {
      return User.findByIdAndUpdate(
        { _id: req.session.currentUser._id },
        { $push: { posts: dbPost._id } }
      );
    })
    .then(() => res.redirect("/userProfile"))
    .catch((error) => console.log(`Error while creating a new post: ${error}`));
});

router.get("/userProfile/:id/edit", (req, res) => {
  const { id } = req.params;
  
  Post.findById(id)
    .then((postToEdit) => {
      res.render("posts/edit-post", postToEdit)
    })
    .catch((err) => console.log(`Could not render the editing page for the post: ${err}`))
});

router.post('/userProfile/:id/edit', (req, res, next) => {
  const { id } = req.params;
  const { title, country, link, intro } = req.body;

  Post.findByIdAndUpdate(
    id,
    { title, country, link, intro },
    { new: true}
  )
    .then((updatedPost) => res.redirect("/userProfile"))
    .catch((err) => console.log(`Could not render the drones page : ${err}`))
});

router.post("/posts/:id/delete", (req, res, next) => {
  const { id } = req.params;
  Post.findByIdAndDelete(id)
    .then(() => res.redirect("/userProfile"))
    .catch((error) => console.log(error));
});

router.get("/logout", (req, res) => {
  res.redirect("/");
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
