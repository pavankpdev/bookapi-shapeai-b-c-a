const express = require("express");

// initialization
const OurAPP = express();

OurAPP.get("/", (request, response) => {
  response.json({ message: "Request Served!!!!!!" });
});

OurAPP.listen(4000, () => console.log("Server is running"));
