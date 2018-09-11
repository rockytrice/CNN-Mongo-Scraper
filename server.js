// Dependencies
var mongoose = require('mongoose');
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var mongojs = require("mongojs");


// Initialize Express=================
var app = express();

// scraping tools====================
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");


// Set up a static folder (public) for our web app
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: true
}));

// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Database configuration====================================================================================
// Save the URL of our database as well as the name of our collection
var databaseUrl = "cnnscraper";
var collections = ["scrapeData"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function (error) {
    console.log("Database Error:", error);
});
// Routes=======================================================================================================
app.get("/", function (req, res) {
    res.render("index", {
        layout: "main"
    });
});
// app.delete("")
// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function (req, res) {
    // make request to cnn website
    request("https://www.cnn.com/world", function (error, response, html) {
        //     // load html body from request into cheerio
        var $ = cheerio.load(html);
        $("h3.cd__headline").each(function (i, element, ) {
            var title = $(element).children().text();
            var link = $(element).children("a").attr("href");
            var summary = $(element).children("a").text();
            if (title && link && summary) {
                // Insert the data in the scrapedData db
                db.scrapedData.insert({
                        title: title,
                        link: link,
                        summary: summary,
                    },
                    function (err, inserted) {
                        if (err) {
                            // Log the error if one is encountered during the query
                            console.log(err);
                        } else {
                            // Otherwise, log the inserted data
                            console.log(inserted);
                        }
                    });
            }

        })
    })
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
});
// find all article route================================================================================================
// Retrieve results from mongo
app.get("/articles", function(req, res) {
    // Find all notes in the notes collection
    db.scrapedData.find({}, function(error, found) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      else {
        // Otherwise, send json of the notes back to user
        // This will fire off the success function of the ajax request
        res.json(found);
      }
    });
  });











// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});