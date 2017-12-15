var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/blog_app", {useMongoClient: true});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created:{type:Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);


app.get("/",function (req,res) {
  res.redirect("/blogs");
});

app.post("/blogs",function(req,res) {
Blog.create(req.body.blog,function (err,newBlog) {
    if(err){
          res.render("new");
    }else{
      res.redirect("/blogs");
    }
  });
});

app.delete("/blogs/:id",function (req,res) {
  Blog.findByIdAndRemove(req.params.id,function(err,updatedBlog) {
    if (err) {
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs");
    }
  });
});

app.get("/blogs/:id/edit",function (req,res) {
  Blog.findById(req.params.id, function (err, foundblog) {
    if (err) {
      console.log(err);
    } else{
      res.render("edit",{blog:foundblog});
    }
  });

});

app.put("/blogs/:id",function (req,res) {
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog) {
    if (err) {
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs/"+req.params.id);
    }
  });
});

app.get("/blogs",function (req,res) {
  Blog.find({},function(err, blogs){
    if(err){
      console.log(err);
    }else{
     res.render("index",{blogs:blogs});
    }
  });

});


app.get("/blogs/new",function (req,res) {
  res.render("new.ejs");
});

app.get("/blogs/:id",function (req,res) {
  Blog.findById(req.params.id, function (err, foundblog) {
    if (err) {
      console.log(err);
    } else{
      res.render("show",{blog:foundblog});
    }
  });

});






app.listen(3000,function(){
  console.log("blog server started");
});
