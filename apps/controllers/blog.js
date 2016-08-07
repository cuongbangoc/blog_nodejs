var express = require("express");
var router = express.Router();

var post_md = require("../models/post");

router.get("/", function(req, res){
    // res.json({"message": "This is Blog Page"});

    var data = post_md.getAllPosts();

    data.then(function(posts){
        var result = {
            posts: posts,
            error: false
        };

        res.render("blog/index", {data: result});
    }).catch(function(err){
        var result = {
            error: "Could not get posts data"
        };

        res.render("blog/index", {data: result});
    });

    // res.render("blog/index");
});

module.exports = router;