const Router = require("express").Router();

//TODO: Student Task
/*
Route           /publication/new
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/

//TODO: Student Task
/*
Route               /publication/delete
Description         delete an publication
Access              PUBLIC
Parameters          id
Method              DELETE
*/
Router.delete("/publication/delete/:id", (req, res) => {
    const { id } = req.params;

    const filteredPub = Database.Publication.filter(
        (pub) => pub.id !== parseInt(id)
    );

    Database.Publication = filteredPub;

    return res.json(Database.Publication);
});

//TODO: Student Task
/*
Route               /publication/delete/book
Description         delete an book from a publication
Access              PUBLIC
Parameters          id, isbn
Method              DELETE
*/
Router.delete("/publication/delete/book/:isbn/:id", (req, res) => {
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

module.exports = Router;
