
// Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Initialize Express
var app = express();

// Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Configure middleware
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

//var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/rreporter";

// Connect to the Mongo DB
//mongoose.connect("mongodb://localhost/rreporter", { useNewUrlParser: true });
mongoose.connect(MONGODB_URI);

// Routes
require("./routes/htmlRoutes")(app);
require("./routes/apiRoutes")(app);


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
