const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

const devisPath = "public/data/devis/"

app.use(express.static('public'));
app.use(express.static('node_modules'));

app.use(express.json());

app.get("/", (req, res) => {
    if (req.url === '/index.html' || req.url === '/') {
        res.sendFile(__dirname + "/index.html");
    }
    if (req.url === '/js/ui.html') {
      res.sendFile(__dirname + "/js/ui.html");
  }

});

app.post("/writeDevis", (req,res) => {
  console.log(req.body);

  const nom = req.body["path"];
  const data = JSON.stringify(req.body["data"], null, "\t");

  fs.writeFile(nom, data, (err) => err && console.error(err));

  return "Devis Sauvegardé !";
  
});

app.post("/getListeDevis", (req,res) => {
  fs.readdir(devisPath, (err, files) => {
    if(err) {
      console.error("Chemin inaccessible ou autre erreur: ", err);
      return;
    }

    res.json(files);

  });
});

app.post("/getDevis", (req,res) => {
  const fichier = req.body["fichier"];  

  var devis = JSON.parse(fs.readFileSync("public/data/devis/"+fichier, 'utf-8'));

  res.json(devis);
  
});

app.post("/writeMateriels", (req,res) => {
  const path = "public/data/materiel.json";
  const data = JSON.stringify(req.body, null, "\t");

  fs.writeFile(path, data, (err) => err && console.error(err));

  return "Materiels Sauvegardés !";
  
});

app.post("/writeDesignations", (req,res) => {
  const path = "public/data/designation.json";
  const data = JSON.stringify(req.body, null, "\t");

  fs.writeFile(path, data, (err) => err && console.error(err));

  return "Designations Sauvegardés !";
  
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

