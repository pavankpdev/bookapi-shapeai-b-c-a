const express = require("express");

// database
const Database = require("./database");

// initialization
const OurAPP = express();

OurAPP.get("/", (request, response) => {
  response.json({ message: "Server is working!!!!!!" });
});

OurAPP.get("/book", (req, res) => {
  return res.json({ books: Database.Book });
});

OurAPP.listen(4000, () => console.log("Server is running"));
