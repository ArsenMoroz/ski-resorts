var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    flash                   = require("connect-flash"),
    LocalStrategy           = require("passport-local"),
    methodOverride          = require("method-override"), 
    passportLocalMongoose   = require("passport-local-mongoose"),
    Resort                  = require("./models/resort"),
    Comment                 = require("./models/comment"),
    User                    = require("./models/user"),
    seedDB                  = require("./seeds")

//requiring routes
var commentRoutes       = require("./routes/comments"),
    resortRoutes    = require("./routes/resorts"),
    authRoutes          = require("./routes/index")

mongoose.connect("mongodb://localhost/ski_resort", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.locals.moment = require("moment");

//seed the database
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/",authRoutes);
app.use("/resorts", resortRoutes);
app.use("/resorts/:id/comments", commentRoutes);

app.listen(3000, function(){
    console.log("The server has started!");
});