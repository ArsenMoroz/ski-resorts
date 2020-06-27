var mongoose = require("mongoose");
var Resort = require("./models/resort");
var Comment = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://img.sunset02.com/sites/default/files/styles/4_3_horizontal_inbody_900x506/public/image/2016/10/main/best-camping-in-the-west-tuolumne-meadows-yosemite-0512.jpg",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non diam phasellus vestibulum lorem sed. Nulla porttitor massa id neque aliquam vestibulum. Urna neque viverra justo nec. Maecenas sed enim ut sem viverra aliquet. Ut ornare lectus sit amet est placerat in. Pharetra convallis posuere morbi leo urna. Eleifend mi in nulla posuere. Vel turpis nunc eget lorem dolor sed viverra ipsum nunc. Laoreet suspendisse interdum consectetur libero id faucibus nisl. Nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit."
    },
    {
        name: "Daisy Mountain",
        image: "https://www.todaysparent.com/wp-content/uploads/2018/05/all-the-best-family-resorts-in-canada4.jpg",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non diam phasellus vestibulum lorem sed. Nulla porttitor massa id neque aliquam vestibulum. Urna neque viverra justo nec. Maecenas sed enim ut sem viverra aliquet. Ut ornare lectus sit amet est placerat in. Pharetra convallis posuere morbi leo urna. Eleifend mi in nulla posuere. Vel turpis nunc eget lorem dolor sed viverra ipsum nunc. Laoreet suspendisse interdum consectetur libero id faucibus nisl. Nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit."
    },
    {
        name: "Camp Nature",
        image: "https://www.fodors.com/wp-content/uploads/2019/02/camp-hero.jpg",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non diam phasellus vestibulum lorem sed. Nulla porttitor massa id neque aliquam vestibulum. Urna neque viverra justo nec. Maecenas sed enim ut sem viverra aliquet. Ut ornare lectus sit amet est placerat in. Pharetra convallis posuere morbi leo urna. Eleifend mi in nulla posuere. Vel turpis nunc eget lorem dolor sed viverra ipsum nunc. Laoreet suspendisse interdum consectetur libero id faucibus nisl. Nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit."
    },
    {
        name: "ARP Resort",
        image: "https://blog.gunassociation.org/wp-content/uploads/2016/06/panorama-mountains-outside-going-sun-resort-best-resorts-in-montana-ss-Feature.jpg",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non diam phasellus vestibulum lorem sed. Nulla porttitor massa id neque aliquam vestibulum. Urna neque viverra justo nec. Maecenas sed enim ut sem viverra aliquet. Ut ornare lectus sit amet est placerat in. Pharetra convallis posuere morbi leo urna. Eleifend mi in nulla posuere. Vel turpis nunc eget lorem dolor sed viverra ipsum nunc. Laoreet suspendisse interdum consectetur libero id faucibus nisl. Nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit."
    }
]

function seedDB(){
    // remove all resorts
    Resort.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed resorts!");

        // //add a few resorts
        //data.forEach(function(seed){
        //    Resort.create(seed, function(err, resort){
        //        if(err){
        //            console.log(err);
        //        }else{
        //            console.log("added a resort!");
        //            //create a comment
        //            Comment.create({
        //                text: "This place is greate but I wish I had Internet here.",
        //                author: "Homer"
        //            }, function(err, comment){
        //                if(err){
        //                    console.log(err);
        //                }else{
        //                    //add username and id to 
        //                    //comment.author.id = req.user._id;
        //                    //comment.author.username = req.user.username;
        //                    //save comment
        //                    //comment.save();
        //                    resort.comments.push(comment);
        //                    resort.save();
        //                    console.log("Created new comment");
        //                }
        //                
        //            });
        //        }
        //    });
//
        //})
    });
}

module.exports = seedDB;

