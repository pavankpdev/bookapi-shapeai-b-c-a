const express = require("express");

// database
const Database = require("./database");

// initialization
const OurAPP = express();

OurAPP.use(express.json());

OurAPP.get("/", (request, response) => {
    response.json({ message: "Server is working!!!!!!" });
});

// Route    - /book
// Des      - To get all books
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
OurAPP.get("/book", (req, res) => {
    return res.json({ books: Database.Book });
});

// Route    - /book/:bookID
// Des      - To get a book based on ISBN
// Access   - Public
// Method   - GET
// Params   - bookID
// Body     - none
OurAPP.get("/book/:bookID", (req, res) => {
    const getBook = Database.Book.filter(
        (book) => book.ISBN === req.params.bookID
    );

    return res.json({ book: getBook });
});

// Route    - /book/c/:category
// Des      - to get a list of books based on category
// Access   - Public
// Method   - GET
// Params   - category
// Body     - none
OurAPP.get("/book/c/:category", (req, res) => {
    const getBook = Database.Book.filter((book) =>
        book.category.includes(req.params.category)
    );

    return res.json({ book: getBook });
});

// Route    - /author
// Des      - to get all authors
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
OurAPP.get("/author", (req, res) => {
    return res.json({ author: Database.Author });
});

// Route       /book/new
// Description add new book
// Access      PUBLIC
// Parameters  NONE
// Method      POST
OurAPP.post("/book/new", (req, res) => {
    console.log(req.body);
    return res.json({ message: "Book Added Successfully" });
});

// Route     /author/new
// Description add new author
// Access PUBLIC
// Parameters NONE
// METHOD POST
OurAPP.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;

    console.log(newAuthor);

    return res.json({ message: "author was added" });
});

OurAPP.post("/pulication/new", (req, res) => {
    const publication = req.body;

    console.log(publication);

    return res.json({ message: "Publication Added" });
});

OurAPP.listen(4000, () => console.log("Server is running"));
