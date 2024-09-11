import {genererMateriel, materiel, addMateriel} from "./materiel.js";
import {genererDesignations, designation} from "./designation.js";
import {devis, genererListeFichiersDevis, genererChampsDevis} from "./devis.js";
//import {writeTo} from "./JSONInterface.mjs";
let activeView = "materiel";

const materielButton = document.querySelector(".btn-materiel");
const designationButton = document.querySelector(".btn-designation");

const infosDocForm = document.querySelector(".infos-devis-form");

const chargerDevisSelect= document.querySelector(".charger-devis-select");
const chargerDevisDropdown= document.querySelector(".charger-devis-dropdown");
const chargerDevisBTN= document.querySelector(".btn-charger-devis");

const addMaterielForm= document.querySelector(".form-add-materiel");
const addMaterielModal = document.querySelector(".modal-add-materiel");



const sectionItems = document.querySelector(".menu-items");


// CHANGER DE PAGE : MATERIELS
materielButton.addEventListener("click", async function(event) {
    sectionItems.innerHTML = "";

    genererMateriel(materiel);
});

// CHANGER DE PAGE : DESIGNATIONS
designationButton.addEventListener("click", async function(event) {
    sectionItems.innerHTML = "";

    genererDesignations(designation);
});

// AJOUTER UN MATERIEL
addMaterielForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const data = new FormData(event.target);

    console.log("CHIASSE");
    

    addMateriel(data);

    addMaterielForm.reset();
    document.querySelector(".modal-add-materiel .btn-close").click();
});

// SELECTIONNER UN DEVIS A CHARGER
chargerDevisSelect.addEventListener("click", async function(event) {
    //Si l'element ciblé est bien une option:
    if(event.target.matches("option"))
    {
        chargerDevisDropdown.innerHTML = event.target.innerHTML;


        console.log(event);
    }
    
});

// CHARGER LE DEVIS SELECTIONNÉ
chargerDevisBTN.addEventListener("click", async function(event) {
    event.preventDefault();

    // SI pas de devis selectionné, abort
    if(chargerDevisDropdown.innerHTML.trim() == "Choisir un devis") {
        console.log("Aucun devis sélectionné, pas d'effet");
        return;
    }
        
    fetch("getDevis", 
    {
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"fichier": chargerDevisDropdown.innerHTML})
    })
    .then(res => {
        return res.json() } )
    .then(jsonData  => {
        genererChampsDevis(jsonData);
    });
    
    
    
});


// ENREGISTRER INFOS DEVIS ACTUEL
infosDocForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const data = new FormData(event.target);

    devis.fichier = data.get("nom-fichier");

    devis.client = data.get("client");
    devis.adresse = data.get("client-adresse");
    devis.mail = data.get("client-mail");
    devis.telephone = data.get("client-num");
    devis.date = data.get("date-devis");
    devis.numDevis = data.get("num-devis");
    devis.type = document.querySelector('input[name="type-valeur"]:checked').id;

    devis.accompte = document.querySelector('input[name="accompte-valeur"]:checked').id;
    devis.tva = document.querySelector('input[name="TVA-valeur"]:checked').id;
    devis.validiteDate = data.get("date-validite-devis");
    
    const requeteBody = JSON.stringify({
        path: "public/data/devis/"+data.get("nom-fichier")+".json",
        data: devis
    });

    console.log(devis);

    fetch("writeDevis", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: requeteBody
    })
    
    genererListeFichiersDevis();
    
});