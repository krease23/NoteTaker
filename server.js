const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    res.send(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;

  const db = fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    const dbJson = JSON.parse(data);
    const lastNote = Object.values(dbJson[dbJson.length - 1]);
    const val = parseInt(lastNote[2]) + 1;

    const newID = { id: val };
    const fullNote = Object.assign(newNote, newID);

    dbJson.push(fullNote);

    const dbStr = JSON.stringify(dbJson);

    fs.writeFile("./db/db.json", dbStr, err => {
      if (err) throw err;
      res.send(JSON.parse(dbStr));
    });
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const db = fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    const dbJson = JSON.parse(data);

    if (parseInt(element.id) === parseInt(req.params.id)) {
      dbJson.splice(index, 1);
    }
  });

  const dbStr = JSON.stringify(dbJson);

  fs.writeFile("./db/db.json", dbStr, err => {
    if (err) throw err;
    res.send(JSON.parse(dbStr));
  });
});

app.listen(PORT, () => {
  console.log("App listening on PORT " + PORT);
});
