const mongoose = require("mongoose");

//Create a book schema
const BookSchema = mongoose.Schema({
    ISBN: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPage: Number,
    category: [String],
    publication: Number,
});

// create a book model
const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;
