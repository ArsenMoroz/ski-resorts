var express = require("express");
var router  = express.Router();
var Resort = require("../models/resort");
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
router.get("/:id", function(req, res){
    //find the resort with provided ID
    Resort.findById(req.params.id).populate("comments").exec(function(err, foundResort){
        if(err){
            req.flash("error", err.message);
            console.log(err);
        } else { 
            console.log(foundResort)
            //render show template with that resort
            res.render("resorts/show", {resort: foundResort});
        }
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
           //redirect somewhere(show page)
           req.flash("success","Successfully Updated!");
           res.redirect("/resorts/" + req.params.id);
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkResortOwnership, function(req, res){
   Resort.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/resorts");
      } else {
          res.redirect("/resorts");
      }
   });
});

function escapeRegex(text){
    return text.replace(/[-\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;