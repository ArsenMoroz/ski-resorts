var express = require("express");
var router  = express.Router();
var Resort = require("../models/resort");
var Review = require("../models/review");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//INDEX - show all resorts
router.get("/", function(req, res){
    var noMatch = '';
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all resorts from DB
        Resort.find({name: regex}, function(err, allResorts){
            if(err){
                console.log(err);
            } else {
                if(allResorts.length < 1){
                    noMatch = "No resorts match that query, please try again";
                }
                res.render("resorts/index",{resorts:allResorts, page: 'resorts', noMatch: noMatch});
            }
         });
    }else{
        // Get all resorts from DB
        Resort.find({}, function(err, allResorts){
           if(err){
               console.log(err);
           } else {
              res.render("resorts/index",{resorts:allResorts, page: 'resorts', noMatch: noMatch});
           }
        });
    }
});

//CREATE - add new resort to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to resorts array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    var newResort = {
        name: name, 
        image: image, 
        price: price, 
        description: desc, 
        author:author
    };
    // Create a new resort and save to DB
    Resort.create(newResort, function(err, newlyCreated){
        if(err){
            console.log(err);
            req.flash("error", err.message);
        } else {
            //redirect back to resorts page
            console.log(newlyCreated);
            res.redirect("/resorts");
        }
    });
});

//NEW - show form to create new resort
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("resorts/new"); 
});

// SHOW - shows more info about one resort
router.get("/:id", function (req, res) {
    //find the resort with provided ID
    Resort.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function (err, foundResort) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that resort
            res.render("resorts/show", {resort: foundResort});
        }
    });
});

// Resort Like Route
router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
    Resort.findById(req.params.id, function (err, foundResort) {
        if (err) {
            console.log(err);
            return res.redirect("/resorts");
        }

        // check if req.user._id exists in foundResort.likes
        var foundUserLike = foundResort.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundResort.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundResort.likes.push(req.user);
        }

        foundResort.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/resorts");
            }
            return res.redirect("/resorts/" + foundResort._id);
        });
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkResortOwnership, function(req, res){
    Resort.findById(req.params.id, function(err, foundResort){
        res.render("resorts/edit", {resort: foundResort});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkResortOwnership, function(req, res){
    // find and update the correct resort
    Resort.findByIdAndUpdate(req.params.id, req.body.resort, function(err, updatedResort){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("back");
        }
        else {
            updatedResort.name = req.body.resort.name;
            updatedResort.description = req.body.resort.description;
            updatedResort.image = req.body.resort.image;
            updatedResort.save(function (err) {
                if (err) {
                    console.log(err);
                    res.redirect("/resorts");
                } else {
                    res.redirect("/resorts/" + updatedResort._id);
                }
            })
           //redirect somewhere(show page)
           //req.flash("success","Successfully Updated!");
           //res.redirect("/resorts/" + req.params.id);
        };
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkResortOwnership, function (req, res) {
    Resort.findById(req.params.id, function (err, resort) {
        if (err) {
            res.redirect("/resorts");
        } else {
            // deletes all comments associated with the resort
            Comment.remove({"_id": {$in: resort.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/resorts");
                }
                // deletes all reviews associated with the resort
                Review.remove({"_id": {$in: resort.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/resorts");
                    }
                    //  delete the resort
                    resort.remove();
                    req.flash("success", "Resort deleted successfully!");
                    res.redirect("/resorts");
                });
            });
        }
    });
});

function escapeRegex(text){
    return text.replace(/[-\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;