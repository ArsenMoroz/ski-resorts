var express = require("express");
var router  = express.Router({mergeParams: true});
var Resort = require("../models/resort");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find resort by id
    console.log(req.params.id);
    Resort.findById(req.params.id, function(err, resort){
        if(err){
            console.log(err);
            req.flash("error", err.message);
        } else {
             res.render("comments/new", {resort: resort});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup resort using ID
   Resort.findById(req.params.id, function(err, resort){
       if(err){
           console.log(err);
           req.flash("error", err.message);
           res.redirect("/resorts");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               resort.comments.push(comment);
               resort.save();
               console.log(comment);
               req.flash("success", "Successfully added comment");
               res.redirect('/resorts/' + resort._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
          req.flash("error", err.message);
      } else {
        res.render("comments/edit", {resort_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
          req.flash("error", err.message);
      } else {
          res.redirect("/resorts/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
           req.flash("error", err.message);
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/resorts/" + req.params.id);
       }
    });
});

module.exports = router;