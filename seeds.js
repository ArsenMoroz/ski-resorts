var mongoose = require("mongoose");
var Resort = require("./models/resort");
var Comment   = require("./models/comment");

function seedDB(){
   //Remove all resorts
   Resort.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed resorts!");
        
        Comment.remove({}, function(err){
            if(err){
                console.log(err);
            }
        });
         //add a few resorts
        //data.forEach(function(seed){
        //    Resort.create(seed, function(err, resort){
        //        if(err){
        //            console.log(err)
        //        } else {
        //            console.log("added a resort");
        //            //create a comment
        //            Comment.create(
        //                {
        //                    text: "This place is great, but I wish there was internet",
        //                    author: "Homer"
        //                }, function(err, comment){
        //                    if(err){
        //                        console.log(err);
        //                    } else {
        //                        resort.comments.push(comment);
        //                        resort.save();
        //                        console.log("Created new comment");
        //                    }
        //                });
        //        }
        //    });
        //});
    }); 
    //add a few comments
}

module.exports = seedDB;
