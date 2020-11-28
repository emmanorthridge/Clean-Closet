const { Router } = require("express");
const router = new Router();
const User = require("../models/users.model");
const Post = require("../models/post.model");
const bcryptjs = require("bcryptjs");
const fileUploader = require("../configs/cloudinary.config");

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
  const { title, country, link, intro, brandsName } = req.body;
  let image;

  if (req.file !== undefined) {
    image = req.file.path;
  } else {
    image = "/images/paper-bag.png";
  }
  Post.create({ title, country, link, intro, brandsName, picture: image })
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
  const { title, country, link, intro, brandsName } = req.body;

  Post.findByIdAndUpdate(
    id,
    { title, country, link, intro, brandsName },
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

module.exports = router;