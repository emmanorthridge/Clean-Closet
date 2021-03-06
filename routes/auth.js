const { Router } = require("express");
const router = new Router();
const User = require("../models/users.model");
const Post = require("../models/post.model");
const bcryptjs = require("bcryptjs");
const fileUploader = require("../configs/cloudinary.config");

router.get("/signup", (req, res) => res.render("auth/signup"));

const saltRounds = 10;

router.post("/signup", fileUploader.single("image"), (req, res, next) => {
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



router.get("/logout", (req, res) => {
  res.redirect("/");
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;