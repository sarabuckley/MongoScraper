var path = require("path");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var axios = require("axios");
var db = require("../models");


module.exports = function (app) {

    // A GET route for scraping the Redmond Reporter website
    app.get("/scrape", function (req, res) {
        console.log("/scrape");
        var scrapeCount = 0;
        // First, we grab the body of the html with axios
        axios.get("http://www.redmond-reporter.com/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // Now, we grab every h4 within an article tag, and do the following:
            $("h4").each(function (i, element) {
                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                    .text();
                result.link = $(this)
                    .children()
                    .attr("href");

                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);

                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
                scrapeCount++;
            });

            // Send a message to the client
            res.json(scrapeCount);
        });
    });

    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        console.log("/articles");
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

    // Route for updating an Article's Saved Status
    app.post("/save/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // Route for deleting a saved article
    app.post("/delete/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
        console.log("get - /articles/:id");
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
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


    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {
        console.log("post - /articles/:id");
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. 
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
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
}