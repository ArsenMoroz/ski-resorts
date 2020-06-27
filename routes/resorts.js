var express = require("express");
var router = express.Router();
var Resort = require("../models/resort");
var middleware = require("../middleware")

//INDEX - Show all resorts
router.get("/", function(req,res){
    req.user
       //Get all resorts from DB
       Resort.find({}, function(err, allResorts){
           if(err){
               console.log(err);
           }else{
               res.render("resorts/index", {data: allResorts, currentUser: req.user}); // it was resorts before
           }
       });
   });
   
//CREATE - Add new resort to database
router.post("/", middleware.isLoggedIn, function(req, res){
       //get data from form and add to resorts array
       var name = req.body.name;
       var price = req.body.price;
       var image = req.body.image;
       var desc = req.body.description;
       var author = {
           id: req.user._id,
           username: req.user.username
       };
       var newResort = {
           name: name,
           price: price,
           image: image,
           description: desc,
           author: author
       };

       //Create a new resort and save it to DB
       Resort.create(newResort, function(err, newlyCreated){
           if(err){
               console.log(err);
           }
           else{
               //redirect back to resort page
               res.redirect("/resorts");
           }
       });
       //resorts.push(newResort)
   });
   
//NEW - show form to create new resort
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("resorts/new");
});
   
//SHOW - shows more information about one resort
router.get("/:id", function(req,res){
    //find the resort with provided id
    Resort.findById(req.params.id).populate("comments").exec(function(err, foundResort){
        if(err || !foundResort){
            req.flash("error", "Resort not found");
            res.redirect("back");
            console.log(err);
        }else{
           //render show template with that resort
           res.render("resorts/show", {resort: foundResort, page: "resorts"});
        }
    });
});

//EDIT - edit existing resort
router.get("/:id/edit", middleware.checkResortOwnership, function(req, res){
        Resort.findById(req.params.id, function(err, foundResort){
            if(err){
                console.log(err);
                return res.redirect("back");
            }
                res.render("resorts/edit", {resort: foundResort});
        });
});

//UPDATE - update existing resort
router.put("/:id", middleware.checkResortOwnership, function(req,res){
    //find and update the correct resort
    Resort.findByIdAndUpdate(req.params.id, req.body.resort, function(err, updatedResort){
        if(err){
            console.log(err);
            return res.redirect("/resorts");
        }
        res.redirect("/resorts/" + req.params.id);
    });
    //redirect somwhere(show page)
});

//DSTROY - deletes existing resort
router.delete("/:id", middleware.checkResortOwnership, function(req, res){
    Resort.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            return res.redirect("/resorts");
        }
        res.redirect("/resorts");
    });
});

module.exports = router;