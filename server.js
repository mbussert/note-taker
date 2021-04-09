// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require("uniqid");
const notesDb = require("./db/db.json");

// Sets up the Express App
const app = express();
const PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

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

// Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => readJSONfile('./db/db.json', function (err, json) {
  if(err) { throw err; }

  res.send(json);
}));

app.post("/api/notes", function(req, res, next) {
  let noteId = uniqid();

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
  
  res.send(newNote)

});

app.delete("/api/notes/:id", function(req, res, next) {

  let key = req.params.id;

  for (let i = 0; i < notesDb.length; i++) {
    if (notesDb[i].id === key) {
      notesDb.splice(i,1);
      res.send(notesDb);

      fs.writeFile("./db/db.json", JSON.stringify(notesDb), function (err) {
        if (err) return console.log(err);
        console.log("Deleted Note ID: ", key);
      });
    }
  }
});

// Starts the server to begin listening

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
