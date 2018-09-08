// Dependencies
var mongoose = require('mongoose');
var express = require("express");
var bodyParser = require("body-parser");
// Initialize Express
var app = express();
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Database configuration====================================================================================
// Save the URL of our database as well as the name of our collection
var databaseUrl = "cnnscraperdb";
var collections = ["articles"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function (error) {
    console.log("Database Error:", error);
});
// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function (req, res) {
    // make request to cnn website
    request("http://cnn.com", function (error, response, hmtl) {

    })
})