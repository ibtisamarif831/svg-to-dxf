const express = require("express");
const app = express();
const port = 3000;
const vectorExpress = require("./node_modules/@smidyo/vectorexpress-nodejs/index");
const fs = require("fs");
var cors = require("cors");
app.use(cors());

 
var bodyParser = require("body-parser");

app.use( express.static( __dirname + '/client' ));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.get('/', (req, res) => {
  res.sendFile( __dirname, +'client'+'/index.html');
})

app.post("/", function (req, res) {
 let svg = req.body;
 fs.writeFile("svgFromFrontend.svg", svg, () => {
   const file = fs.readFileSync(__dirname + "/svgFromFrontend.svg");
   vectorExpress
     .convert("svg", "dxf", {
       file,
       save: true,
       path: __dirname + "/svgFromFrontendConverted.dxf",
     })
     .then((res) => {
       console.log();
     });
 });
 
 res.send("Converted");
});
app.listen(port, () => console.log(`Example app listening on ${port} port!`));
