var express = require("express");
var app = express();
const path = require('path');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//controllers
var boostrap = require("./boostrap");
var search = require("./search");

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.post("/search", async function(req, res) {
  var result = await search.searchCountry(req.body.latitude,req.body.longitude)
  res.json(result);
});

app.get("/boostrap", function(req, res) {
  boostrap.start();
  res.send("boostraped!!");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
