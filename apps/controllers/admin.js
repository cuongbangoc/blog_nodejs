var express = require("express");
var router = express.Router();

var user_md = require("../models/user");
var post_md = require("../models/post");

var helper = require("../helpers/helper");

router.get("/", function(req, res){
    // res.json({"message": "This is Admin Page"});
    var data = post_md.getAllPosts();
    data.then(function(posts){
        var data = {
            posts: posts,
            error: false
        };

        res.render("admin/dashboard", {data: data});
    }).catch(function(err){
        res.render("admin/dashboard", {data: {error: "Get Post data is Error"}});
    });

});

router.get("/signup", function(req, res){
    res.render("signup", {data: {}});
});

router.post("/signup", function(req, res){
    var user = req.body;

    if(user.email.trim().length == 0){
        res.render("signup", {data: {error: "Email is required"}});
    }

    if(user.passwd != user.repasswd && user.passwd.trim().length != 0){
        res.render("signup", {data: {error: "Password is not Match"}});
    }

    // Insert to DB
    var password = helper.hash_password(user.passwd);

    user = {
        email: user.email,
        password: password,
        first_name: user.firstname,
        last_name: user.lastname
    };

    var result = user_md.addUser(user);

    result.then(function(data){
        res.redirect("/admin/signin");
    }).catch(function(err){
        console.log(err);
        res.render("signup", {data: {error: "error"}});
    });

});

router.get("/signin", function(req, res){
    res.render("signin", {data: {}});
});

router.post("/signin", function(req, res){
    var params = req.body;

    if(params.email.trim().length == 0){
        res.render("signin", {data: {error: "Please enter an email"}});
    }else{
        var data = user_md.getUserByEmail(params.email);

        if(data){
            data.then(function(users){
                var user = users[0];

                var status = helper.compare_password(params.password, user.password);

                if(!status){
                    res.render("signin", {data: {error: "Password Wrong"}});
                }else{
                    req.session.user = user;
                    console.log(req.session.user);
                    res.redirect("/admin/");
                }
            });
        }else{
            res.render("signin", {data: {error: "User not exists"}});
        }
    }

});

router.get("/post/new", function(req, res){
    res.render("admin/post/new", {data: {error: false}});
});

router.post("/post/new", function(req, res){
    var params = req.body;

    var now = new Date();
    params.created_at = now;
    params.updated_at = now;

    var data = post_md.addPost(params);

    data.then(function(result){
        res.redirect("/admin");
    }).catch(function(err){
        var data = {
            error: "Could not insert post"
        };

        res.render("admin/post/new", {data: data});
    });
});

module.exports = router;


