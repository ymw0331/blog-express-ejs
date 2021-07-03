//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const dotenv = require("dotenv").config();
const db_user = process.env.DB_USERNAME
const db_password = process.env.DB_PASSWORD



const mongoose = require("mongoose")

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(`mongodb+srv://${db_user}:${db_password}@cluster0.soaw7.mongodb.net/blogDB`, { useNewUrlParser: true, useUnifiedTopology: true })

// mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = {
  title: String,
  content: String
}

const Post = mongoose.model("Post", postSchema)

// const post1 = new Post({
//   title: "Day Test",
//   content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum  "
// })

// const post2 = new Post({
//   title: "Day Test2",
//   content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum  "
// })

// const defaultPosts = [post1, post2]

// Post.insertMany(defaultPosts, function (err) {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log("Blogs are successfully inserted into DB")
//     // res.render("home", { startContent: homeStartingContent, posts: posts})

//   }
// })


// let posts = [] //delete the existing posts array



app.get("/", function (req, res) {

  //find all the posts in the posts collection and render that in the home.ejs file.
  Post.find({}, function (err, foundPost) {
    res.render("home", {
      startContent: homeStartingContent,
      posts: foundPost
    })
  })
})


app.get("/about", function (req, res) {

  res.render("about", { contentAbout: aboutContent })

})


app.get("/contact", function (req, res) {

  res.render("contact", { contentContact: contactContent })
})


app.get("/compose", function (req, res) {

  res.render("compose")
})


app.post("/compose", function (req, res) {

  //create a new post document using your mongoose model
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  })
  post.save(function (err) {
    if (!err) {
      res.redirect("/")
    } else {
      console.log("Error to save post")
    }
  })

  // posts.push(post), save the document to your database instead of pushing to the posts array.

})

app.get("/posts/:postId", function (req, res) {
  // console.log(req.params.postName)

  // const requestedPostId = _.lowerCase(req.params.postName)
  const requestedPostId = req.params.postId;



  Post.findOne({ _id: requestedPostId }, function (err, post) {
    // if (!err) {
    //   console.log("Doesnt exist")

    //   // const post = new Post({
    //   //   title: newTitle,
    //   //   content: newContent
    //   // })
    //   // post.save()
    //   // res.redirect("/" + requestedTitle)
    // }
    // else {
    console.log("Exist")

    res.render("post", { title: post.title, content: post.content })
  })
  // })

  // posts.forEach(function (post) {
  //   const storedTitle = _.lowerCase(post.title)

  //   if (storedTitle === requestedTitle) {
  //     // console.log("Match found!")

  //     res.render("post", {
  //       title: post.title,
  //       content: post.content
  //     })
  //   }
  // })
})


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
