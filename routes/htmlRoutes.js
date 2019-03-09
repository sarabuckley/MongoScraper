var path = require("path");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var db = require("../models");


module.exports = function (app) {

    // Load initial index page
    app.get("/", function (req, res) {

        // Check if any articles exist in the database
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                if (dbArticle) {
                    res.render("index", {
                        article: dbArticle
                    });
                }
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Check if any articles exist in the database
    app.get("/saved", function (req, res) {
        db.Article.find({ saved: true })
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                if (dbArticle) {
                    res.render("saved", {
                        article: dbArticle
                    });
                }
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
}
