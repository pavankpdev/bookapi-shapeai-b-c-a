require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

//Importing Different Schema's
const Book = require("./schema/book");
const Author = require("./schema/author");
const Publication = require("./schema/publication");

// database
const Database = require("./database");

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => console.log("connection extablished!"))
    .catch((err) => {
        console.log(err);
    });

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
OurAPP.get("/book", async (req, res) => {
    const getAllBooks = await Book.find();
    return res.json(getAllBooks);
});

// Route    - /book/:bookID
// Des      - To get a book based on ISBN
// Access   - Public
// Method   - GET
// Params   - bookID
// Body     - none
OurAPP.get("/book/:bookID", async (req, res) => {
    const getSpecificBook = await Book.findOne({ ISBN: req.params.bookID });

    if (!getSpecificBook) {
        return res.json({
            error: `No book found fot the ISBN of ${req.params.bookID}`,
        });
    }

    return res.json({ book: getSpecificBook });
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
OurAPP.post("/book/new", async (req, res) => {
    try {
        const { newBook } = req.body;

        await Book.create(newBook);
        return res.json({ message: "Book added to the database" });
    } catch (error) {
        return res.json({ error: error.message });
    }
});

// Route     /author/new
// Description add new author
// Access PUBLIC
// Parameters NONE
// METHOD POST
OurAPP.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;

    Database.Author.push(newAuthor);

    return res.json(Database.Author);
});

//TODO: Student Task
/*
Route           /publication/new
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/

// Route           /book/updateTitle
// Description     update title of a book
// Access          PUBLIC
// Parameters      isbn
// Method          PUT
OurAPP.put("/book/updateTitle/:isbn", (req, res) => {
    const { updatedBook } = req.body;
    const { isbn } = req.params;

    Database.Book.forEach((book) => {
        if (book.ISBN === isbn) {
            book.title = updatedBook.title;
            return book;
        }
        return book;
    });

    return res.json(Database.Book);
});

// Route       /book/updateAuthor/:isbn
// Description update/add new author to a book
// Access      Public
// Paramteters isbn
// Method      put

OurAPP.put("/book/updateAuthor/:isbn", (req, res) => {
    const { newAuthor } = req.body;
    const { isbn } = req.params;

    // updating book database object
    Database.Book.forEach((book) => {
        // check if ISBN match
        if (book.ISBN === isbn) {
            // check if author already exist
            if (!book.authors.includes(newAuthor)) {
                // if not, then push new author
                book.authors.push(newAuthor);
                return book;
            }

            // else return
            return book;
        }
        return book;
    });

    // updating author Database object
    Database.Author.forEach((author) => {
        // check if author id match
        if (author.id === newAuthor) {
            // check if book already exist
            if (!author.books.includes(isbn)) {
                // if not, then push new book
                author.books.push(isbn);
                return author;
            }

            // else return
            return author;
        }
        return author;
    });

    return res.json({ book: Database.Book, author: Database.Author });
});

//TODO: Studen Task
// Route       /author/updateName
// Description Update name of the author
// Access      Public
// Parameters  id
// Method      Put
// Params in the req.body are always in string format

/*
Route               /book/delete/:isbn
Description         delete a book
Access              PUBLIC
Parameters          isbn
Method              DELETE
*/
OurAPP.delete("/book/delete/:isbn", (req, res) => {
    const { isbn } = req.params;

    const filteredBooks = Database.Book.filter((book) => book.ISBN !== isbn);

    Database.Book = filteredBooks;

    return res.json(Database.Book);
});

/*
Route                   /book/delete/author
Description             delte an author from a book
Access                  PUBLIC
Parameters              id, isdn
Method                  DELETE
*/
OurAPP.delete("/book/delete/author/:isbn/:id", (req, res) => {
    const { isbn, id } = req.params;

    //updating book database object
    Database.Book.forEach((book) => {
        if (book.ISBN === isbn) {
            if (!book.authors.includes(parseInt(id))) {
                return;
            }

            book.authors = book.authors.filter(
                (databaseId) => databaseId !== parseInt(id)
            );
            return book;
        }
        return book;
    });

    Database.Author.forEach((author) => {
        if (author.id === parseInt(id)) {
            if (!author.books.includes(isbn)) {
                return;
            }

            author.books = author.books.filter((book) => book !== isbn);

            return author;
        }
        return author;
    });

    return res.json({ book: Database.Book, author: Database.Author });
});

/*
Route               /author/delete
Description         delete an author
Access              PUBLIC
Parameters          id
Method              DELETE
*/
OurAPP.delete("/author/delete/:id", (req, res) => {
    const { id } = req.params;

    const filteredAuthors = Database.Author.filter(
        (author) => author.id !== parseInt(id)
    );

    Database.Author = filteredAuthors;

    return res.json(Database.Author);
});

/*
Route               /publication/delete
Description         delete an publication
Access              PUBLIC
Parameters          id
Method              DELETE
*/
OurAPP.delete("/publication/delete/:id", (req, res) => {
    const { id } = req.params;

    const filteredPub = Database.Publication.filter(
        (pub) => pub.id !== parseInt(id)
    );

    Database.Publication = filteredPub;

    return res.json(Database.Publication);
});

/*
Route               /publication/delete/book
Description         delete an book from a publication
Access              PUBLIC
Parameters          id, isbn
Method              DELETE
*/
OurAPP.delete("/publication/delete/book/:isbn/:id", (req, res) => {
    const { isbn, id } = req.params;

    Database.Book.forEach((book) => {
        if (book.ISBN === isbn) {
            book.publication = 0;
            return book;
        }
        return book;
    });

    Database.Publication.forEach((publication) => {
        if (publication.id === parseInt(id)) {
            const filteredBooks = publication.books.filter(
                (book) => book !== isbn
            );
            publication.books = filteredBooks;
            return publication;
        }
        return publication;
    });

    return res.json({ book: Database.Book, publication: Database.Publication });
});

OurAPP.listen(4000, () => console.log("Server is running"));
