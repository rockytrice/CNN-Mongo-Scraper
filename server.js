// Dependencies
var mongoose = require('mongoose');
var express = require("express");
var bodyParser = require("body-parser");
// Initialize Express
var app = express();
var request = require("request");
var cheerio = require("cheerio");
// Set up a static folder (public) for our web app
app.use(express.static("public"));