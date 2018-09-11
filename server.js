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

// Use morgan logger for logging requests
app.use(logger("dev"));
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
// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/cnnScraper", { useNewUrlParser: true });
// // This makes sure that any errors are logged if mongodb runs into an issue
// db.on("error", function (error) {
//     console.log("Database Error:", error);
// });
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
            var result = {};
            // Add the text,summary and href of every link, and save them as properties of the result object
            result.title = $(this)
             .children()
             .text();
            result.link = $(this)
             .children("a")
             .attr("href");
            result.summary = $(this)
             .children("a")
             .text();


            
            // var title = $(element).children().text();
            // var link = $(element).children("a").attr("href");
            // var summary = $(element).children("a").text();
            // if (title && link && summary) {
            //     // Insert the data in the scrapedData db
            //     db.scrapedData.insert({
            //             title: title,
            //             link: link,
            //             summary: summary,
            //         },
            //         function (err, inserted) {
            //             if (err) {
            //                 // Log the error if one is encountered during the query
            //                 console.log(err);
            //             } else {
            //                 // Otherwise, log the inserted data
            //                 console.log(inserted);
            //             }
            //         });
            // }

        })
    })
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
});
// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });











// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});