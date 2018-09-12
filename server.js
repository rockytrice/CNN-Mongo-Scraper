// Dependencies
var mongoose = require('mongoose');
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");


// Initialize Express=================
var app = express();

// scraping tools====================
var axios = require("axios");
var cheerio = require("cheerio");

var PORT = 3000;

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
//  If deployed, use the deployed database. Otherwise use the local mongoHeadlines database 
 var MONGODB_URI = process.env.MONGODB_URI ||"mongodb://localhost/cnnScraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// Routes=======================================================================================================
app.get("/", function (req, res) {
    res.render("index", {
        layout: "main"
    });
});
// Scrape data from one site and place it into the mongodb db======================================================
app.get("/scrape", function (req, res) {
    // make request to cnn website
    axios.get("https://www.cnn.com/world").then(function (response) {
        //     // load html body from request into cheerio
        var $ = cheerio.load(response.data);
        $("h3.cd__headline").each(function (i, element) {
            if(i < 20) {

            
            var result = {};
            // Add the text,summary and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href")
            result.summary = $(this)
                .children("a")
                .text();
              

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
             
               });
            }
        });
        //  Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db================================================================================
app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note=======================================================
app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({
            _id: req.params.id
        })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note=====================================================================
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                note: dbNote._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Clear the DB
app.get("/clearall", function(req, res) {
  // Remove every note from the notes collection
  db.notes.remove({}, function(error, response) {
    // Log any errors to the console
    if (error) {
      console.log(error);
      res.send(error);
    }
    else {
      // Otherwise, send the mongojs response to the browser
      // This will fire off the success function of the ajax request
      console.log(response);
      res.send(response);
    }
  });
});
// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});