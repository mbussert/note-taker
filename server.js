// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require("uniqid");

// Sets up the Express App
const app = express();
const PORT = 3000;


// Read db.json
function readJSONfile(filename, callback) {
  fs.readFile(filename, function (err, data) {
    if(err) {
      callback(err);
      return;
    }
    try {
      callback(null, JSON.parse(data));
    } catch(exception) {
      callback(exception);
    }
  });
}

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => readJSONfile('./db/db.json', function (err, json) {
  if(err) { throw err; }
  console.log(json);
  res.send(json);
}));

app.post("/api/notes", function(req, res, next) {
  let noteId = uniqid();
  let noteSaved;

  let title = req.body.title;
  let text = req.body.text;
  let newNote = {"id": noteId, "title": title, "text": text};
  
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    
    let obj = JSON.parse(data);
    
    obj.push(newNote);

    let strNote = JSON.stringify(obj);

    fs.writeFile("./db/db.json", strNote, function(err) {
      if (err) return console.log(err);
      console.log("New note added!");
    });
  });

  console.log(req.body);
  console.log('Note ID: ', noteId);
  noteSaved = true;
  
  res.send(newNote)

});


// Starts the server to begin listening

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
