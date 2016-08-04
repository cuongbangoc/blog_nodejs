var express = require("express");
var router = express.Router();

var user_md = require("../models/user");

var helper = require("../helpers/helper");

router.get("/", function(req, res){
    res.json({"message": "This is Admin Page"});
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

module.exports = router;


