//all middleware goes here
var Resort = require("../models/resort.js");
var Comment = require("../models/comment.js");

var middlewareObj ={};

middlewareObj.checkResortOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Resort.findById(req.params.id, function(err, foundResort){
            if(err || !foundResort){
                req.flash("error", "Resort not found");
                console.log(err);
                return res.redirect("back");
            }
            //does the user own Resort
            if(foundResort.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash("error", "You don't have the permission to do that");
                res.redirect("back");
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }
};


middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                console.log(err);
                return res.redirect("back");
            }
            //does the user own Resort
            if(foundComment.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj