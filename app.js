const bodyParser=require("body-parser");
const methodOverride=require("method-override");
const express =require("express");
const mongoose =require("mongoose");
const expressSanitizer=require("express-sanitizer");
//app config
var app=express();
const port=process.env.PORT || 3000;
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/restfull_blogApp2");
mongoose.connect('mongodb://restfull:bsyhibcatha@14@ds145921.mlab.com:45921/restfull_blogs')
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//mongo config
var blogSchema=new mongoose.Schema({
title:String,
image:String,
body:String,
created:{type:Date,default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);


// Restful routes
app.get("/",(req,res)=>{
    res.redirect("/blogs");
    });

  //Index
app.get("/blogs",(req,res)=>{
    Blog.find({},(err,blogs)=>{
if(err){
    console.log("Error in finding the BLogs");
}
else{
    res.render("index",{blogs:blogs});
}
    });
});
// app.get("/blogs",(req,res)=>{
//     Blog.find({}),then((blogs)=>{
//         res.render("index",{blogs});
//     }).catch((e)=>{
//         res.send("Something is wrong");
//     })
// })

//New Route
app.get("/blogs/new",(req,res)=>{
    res.render("new");
    });

//Create Route
app.post("/blogs",(req,res)=>{
    //create blog
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,(err,newBlog)=>{
if(err){
    res.render("new");
}
else{
    res.redirect("/blogs");
}
    });

});

//Show Route
app.get("/blogs/:id",(req,res)=>{
Blog.findById(req.params.id,(err,foundBlog)=>{
if(err){
    res.redirect("/blogs");
}
else{
    res.render("show",{blog:foundBlog});
}
});
});


// Edit route
app.get("/blogs/:id/edit",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:foundBlog});

        }
    });
});

// Update route
app.put("/blogs/:id",(req,res)=>{
Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
    req.body.blog.body=req.sanitize(req.body.blog.body);
    if(err){
        res.redirect("/blogs");
    }
    else{
        res.redirect("/blogs/" +req.params.id);
    }
})
});

//Delete
app.delete("/blogs/:id",(req,res)=>{
Blog.findByIdAndRemove(req.params.id,(err)=>{
    if(err){
        res.redirect("/blogs");
    }
    else{
        res.redirect("/blogs");
    }
})
});

app.listen(port,(err,result)=>{
if(err){
    console.log("Server has some problem");
}else{
    console.log("Server is started");
}
})