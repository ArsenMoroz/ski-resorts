var express = require("express");
var router = express.Router({mergeParams: true});
var Resort = require("../models/resort");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//NEW (comments new)
router.get("/new", middleware.isLoggedIn, function(req,res){
    // find resort by id
    Resort.findById(req.params.id, function(err, resort){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {resort: resort});
        }
    });
    
});

//CREATE (comments create)
router.post("/", middleware.isLoggedIn, function(req,res){
    //lookup resort using id
    Resort.findById(req.params.id, function(err, resort){
        if(err){
            console.log(err);
            res.redirect("/resorts");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    resort.comments.push(comment);
                    resort.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/resorts/" + resort._id);
                }
            });
        }
    });
});

//EDIT route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    //Resort.findById(req.params.comment_id, function(err, foundResort){
    //    if(err || !foundResort){
    //    req.flash("error", "No resort found");
    //        return res.redirect("back");
    //    }

        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
                res.redirect("back");
            }else{
                res.render("comments/edit", {resort_id: req.params.id, comment: foundComment});
            }
        });
    });
//});

//UPDATE route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
            console.log(err);
        }else{
            res.redirect("/resorts/" + req.params.id);
        }
    });
});

//DESTROY route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/resorts/" + req.params.id);
        }
   });
});

module.exports = router;