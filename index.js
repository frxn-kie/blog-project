import express from "express";
import methodOverride from 'method-override';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded ({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(express.static("public"));

app.set('view engine','ejs');

// posts

let posts = [
  {
    id: 1,
    title: "Welcome to WriteRight",
    copy: "Here we share our Content Guidelines and tips for success."
  },
];

// render homepage

app.get("/", (req, res) => {
    res.render("index.ejs", {posts});
});

// // route to view post
// const blogItem = document.querySelector('#blog-item');
// blogItem.addEventListener('click', function() {
// app.get("/view/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   const foundPost = posts.find((post) => post.id === id);
//   if (!foundPost) {
//     return res.status(404).json({message: "Post not found"});
//     res.redirect("/");
//   } else {
//   res.render("view.ejs", {foundPost});
//   }
// });
// });

// route to create new post

app.get("/create", (req, res) => {
  res.render("create.ejs");
});

// route to save new post

app.post("/save", (req, res) => {
  if (posts.length>0) {
  const newPost = {
    id: posts.slice(-1)[0].id +1,
title: req.body.newTitle,
copy: req.body.newCopy,
  };
  posts.push(newPost);
  res.redirect("/");
} else {
  const newPost = {
    id: 1,
title: req.body.newTitle,
copy: req.body.newCopy,
};
  posts.push(newPost);
    res.redirect("/");
};
  });

// route to edit existing post

  app.get("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const foundPost = posts.find((post) => post.id === id);
    if (!foundPost) {
      return res.status(404).json({message: "Post not found"});
      res.redirect("/");
    } else {
    res.render("edit.ejs", {foundPost});
    }
  });

  // route to save edited post

app.post("/edit/save/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let foundPost = posts.find((post) => post.id === id);
  if (!foundPost) return res.status(404).json({message: "Post not found"});
  const updatedPost = {
    id: foundPost.id,
    title: req.body.title || foundPost.title,
    copy: req.body.copy || foundPost.copy,
      };
  foundPost = updatedPost;
  var foundIndex = posts.findIndex(post => id == post.id);
posts[foundIndex] = updatedPost;
  // res.json({ message: "Post updated", post: foundPost });
  res.render("view.ejs", {foundPost});
});

// route to delete post

app.get("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const searchIndex = posts.findIndex((post) => post.id === id);
  if (searchIndex > -1) {
    posts.splice(searchIndex, 1);
    res.redirect("/");
  } else {
    res.status(404).json({ error: "Post not found. No posts were deleted." });
  }
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});
