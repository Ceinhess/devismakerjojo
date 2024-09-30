import 
{genererMateriel, materiel, addMateriel, genererProprietesMateriel, changeMateriel, 
getMaterielByID, deleteMateriel} 
from "./materiel.js";

import 
{genererDesignations, designation, addDesignation, genererProprietesDesignation, changeDesignation, 
getDesignationByID, deleteDesignation, addMatToDesignation,
getSelectedDesignation} 
from "./designation.js";

import 
{devis, genererListeFichiersDevis, genererChampsDevis, genererElementDesignationDevis, addDesToDevis} 
from "./devis.js";

// Variables

let activeView = "materiel";

let selectedItem = null;

const materielButton = document.querySelector(".btn-materiel");
const designationButton = document.querySelector(".btn-designation");

const infosDocForm = document.querySelector(".infos-devis-form");

const chargerDevisSelect= document.querySelector(".charger-devis-select");
const chargerDevisDropdown= document.querySelector(".charger-devis-dropdown");
const chargerDevisBTN= document.querySelector(".btn-charger-devis");

const fermerDevisBTN= document.querySelector(".btn-close");
const submitDevisBTN = document.querySelector(".btn-infosDoc");

const addDesDevisBTN = document.querySelector(".btn-devis-add-des");
const infosDevisWrapper = document.querySelector(".wrapper-infos-devis");
const desDevisContainer = document.querySelector(".container-designation");



const addMaterielForm= document.querySelector(".form-add-materiel");
const addMaterielModal = document.querySelector(".modal-add-materiel");

const addDesignationForm= document.querySelector(".form-add-designation");
const addDesignationModal = document.querySelector(".modal-add-designation");

const sectionItems = document.querySelector(".menu-items");



function getAllItems() {
    if(activeView == "materiel" || activeView == "modifDesignation")
        return document.querySelectorAll(".materiel-item");
    else if(activeView == "designations" || activeView == "addDesignation")
        return document.querySelectorAll(".designation-item");
}

// GENERER PAGE
function genererItems() {
    sectionItems.innerHTML = "";

    if(activeView == "materiel") // Si materiel
    {
        genererMateriel(materiel);
    }
    else if(activeView == "designations") // Si designations
    {
        genererDesignations(designation);
    }
    else if(activeView == "modifDesignation") // Si ajout de materiel a une designation
    {
        genererMateriel(materiel);

        //genererProprietes(selectedItem);

        const listeElements = getAllItems();
        listeElements.forEach(elem => {
            elem.addEventListener("click", async function(event) {
                addItemToDesignation(event);    
            });
        });

        return;
    }

    else if(activeView == "addDesignation") 
    {
        genererDesignations(designation);

        const listeElements = getAllItems();

        listeElements.forEach(elem => {
            elem.addEventListener("click", async function(event) {
                addDesignationDevis(event);    
            });
        });

        return;
    }

    // Ajoute l'evenement de selection
    const listeElements = getAllItems();
    listeElements.forEach(elem => {
        elem.addEventListener("click", async function(event) {
            selectItem(event);    
        });
        if(elem.dataset.id == selectedItem)
        {
            elem.click();
        }
            
    });

    genererProprietes(selectedItem);
}

// GENERER PROPRIETES
function genererProprietes(item = null) {
    if(activeView == "materiel") {
        genererProprietesMateriel(getSelectedItem());
    } else {
        genererProprietesDesignation(getSelectedItem());
    }

    // Si pas d'item de selectionné, pas besoin des events
    if(item === null)
        return;
    
    const propForm = document.querySelector(".proprietes-element-form");
    const delBTN = document.querySelector(".proprietes-btn-suppr");

    if(activeView == "designations") {
        const modifDesBTN = document.querySelector(".proprietes-btn-modif");
        modifDesBTN.addEventListener("click", async function(event) {
            changeModifBTN("modif");
        });
    }
    else if(activeView == "modifDesignation") {
        // rien
    }

    propForm.addEventListener("submit", async function(event) {
        changeItem(getSelectedItem(), event);
    });

    delBTN.addEventListener("click", async function(event) {
        delBTN.classList.remove("btn-danger");
        delBTN.classList.add("btn-warning");
        delBTN.innerHTML = "Sûr ? (Action irréversible)";

        delBTN.removeEventListener("click", async function(event) {});
        delBTN.addEventListener("click", async function(event) {
            deleteItem(item);
        });
    });
}

function changeModifBTN(action) {
    const desBTN = document.querySelector(".btn-designation");
    const matBTN = document.querySelector(".btn-materiel");
    const saveBTN = document.querySelector(".proprietes-btn-submit");
    const delBTN = document.querySelector(".proprietes-btn-suppr");
    const modifDesBTN = document.querySelector(".proprietes-btn-modif");

    if(action == "retour") {            
        activeView = "designations";

        desBTN.removeAttribute("disabled");
        matBTN.removeAttribute("disabled");
        saveBTN.removeAttribute("disabled");
        delBTN.removeAttribute("disabled");

        genererItems();

        modifDesBTN.removeEventListener("click", async function(event) {});
        modifDesBTN.innerHTML = "Ajouter matériel"
        modifDesBTN.classList.remove("btn-success")
        modifDesBTN.classList.add("btn-primary")
        
        modifDesBTN.addEventListener("click", async function(event) {
            changeModifBTN("modif");
        });

        

    } else {            
        activeView = "modifDesignation";

        desBTN.setAttribute("disabled", 1);
        matBTN.setAttribute("disabled", 1);
        saveBTN.setAttribute("disabled", 1);
        delBTN.setAttribute("disabled", 1);

        genererItems();

        modifDesBTN.removeEventListener("click", async function(event) {});
        modifDesBTN.innerHTML = "Retour"
        modifDesBTN.classList.remove("btn-primary")
        modifDesBTN.classList.add("btn-success")
        
        modifDesBTN.addEventListener("click", async function(event) {
            changeModifBTN("retour");
        });
    }
}

// CHANGE UN ITEM
async function changeItem(item, event){
    if(activeView == "materiel") {
        await changeMateriel(item, event);
    } else {
        await changeDesignation(item, event);
    }
    genererItems();
}

// SUPPRIME UN ITEM
async function deleteItem(item){
    console.log(item);
    unselectItem();
    if(activeView == "materiel") {
        await deleteMateriel(item);
    } else {
        await deleteDesignation(item);
    }

    
    genererItems();
}

// RECUPERER ITEM SELECTIONNE
function getSelectedItem() {
    if(activeView == "materiel") {
        return getMaterielByID(selectedItem);
    } else {
        return getDesignationByID(selectedItem);
    }
}

// DESELECTIONNER UN ELEMENT
function unselectItem() {
    selectedItem = null;
    try {
        
        document.querySelector(".selected").classList.remove("selected");
        genererProprietes();
    } catch(e) {

    }
}

// SELECTIONNER UN ELEMENT
function selectItem(event) {
    // item = la div contenant toutes les informations de l'element selectionne
    let item = event["target"];
    let type = item.classList.contains(".materiel-item") ? "materiel" : "designation"

    // permet d'etre sur qu'item est bien la div parente
    while(!(item.classList.contains("materiel-item") || item.classList.contains("designation-item"))) {
        item = item.parentElement;
    }

    // Si click sur deja selectionné, deselectionne
    if(item.dataset.id == selectedItem && item.classList.contains("selected"))   {
        unselectItem();
        return;
    }

    // Si autre element selectionné, deselectionne
    try {
        document.querySelector(".selected").classList.remove("selected");
    } catch(e) {
        
    }

    item.classList.add("selected");
    selectedItem = item.dataset.id;

    genererProprietes(selectedItem);
    
}

function addItemToDesignation(event) {
    let item = event["target"];

    while(!(item.classList.contains("materiel-item"))) {
        item = item.parentElement;
    }

    const des = getDesignationByID(selectedItem);

    // TRUE si l'objet est déjà dans la liste de materiel de la designation
    const exists = des.materiels.some(el => el.id == item.dataset.id);

    if(!exists) {
        addMatToDesignation(getMaterielByID(item.dataset.id), des);
    }
    

    console.log(getMaterielByID(item.dataset.id));
    
}

 
//          ---------- CHANGER PAGE ---------------

// CHANGER DE PAGE : MATERIELS
materielButton.addEventListener("click", async function(event) {
    activeView = "materiel";
    unselectItem();
    genererItems();
});

// CHANGER DE PAGE : DESIGNATIONS
designationButton.addEventListener("click", async function(event) {
    activeView = "designations";
    unselectItem();
    genererItems();
});

// CHANGER DE PAGE : MODIFIER MATERIELS DESIGNATIONS
function genererPageMatDesignation(des) {
    
}


//          ----------AJOUTS ITEMS-----------

// AJOUTER UN MATERIEL
addMaterielForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const data = new FormData(event.target);    

    addMateriel(data);
    genererItems();

    addMaterielForm.reset();
    document.querySelector(".modal-add-materiel .btn-close").click();
});

// AJOUTER UNE DESIGNATION
addDesignationForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const data = new FormData(event.target);

    addDesignation(data);
    genererItems();

    addDesignationForm.reset();
    document.querySelector(".modal-add-designation .btn-close").click();
});

//           ------------DEVIS----------------

// SELECTIONNER UN DEVIS A CHARGER
chargerDevisSelect.addEventListener("click", async function(event) {
    //Si l'element ciblé est bien une option:
    if(event.target.matches("option"))
    {
        chargerDevisDropdown.innerHTML = event.target.innerHTML;
        chargerDevisDropdown.click();

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

// AJOUTE DESIGNATION AU DEVIS
function addDesignationDevis(event) {
    let item = event["target"];

    while(!(item.classList.contains("materiel-item") || item.classList.contains("designation-item"))) {
        item = item.parentElement;
    }

    const desId = item.dataset.id;

    addDesToDevis(desId);

    const desElement = genererElementDesignationDevis(desId);
    
    desDevisContainer.appendChild(desElement);

    console.log(desId);
    
}

// CHANGER VUE POUR AJOUTER DESIGNATIONS AU DEVIS
addDesDevisBTN.addEventListener("click", async function(event) {
    if(activeView != "addDesignation")
    {
        infosDevisWrapper.classList.remove("col-6");
        infosDevisWrapper.classList.add("col-4", "col-xl-3", "col-xxl-2");

        activeView = "addDesignation";


        addDesDevisBTN.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                                    </svg>`;

        addDesDevisBTN.classList.remove("btn-primary");
        addDesDevisBTN.classList.add("btn-success", "w-100");

        fermerDevisBTN.setAttribute("disabled", 1);
        submitDevisBTN.setAttribute("disabled", 1);
        chargerDevisBTN.setAttribute("disabled", 1);
    }
    else 
    {
        infosDevisWrapper.classList.add("col-6");
        infosDevisWrapper.classList.remove("col-4", "col-xl-3", "col-xxl-2");

        activeView = "materiel";
        

        addDesDevisBTN.innerHTML = '+';

        addDesDevisBTN.classList.add("btn-primary");
        addDesDevisBTN.classList.remove("btn-success", "w-100");

        fermerDevisBTN.removeAttribute("disabled");
        submitDevisBTN.removeAttribute("disabled");
        chargerDevisBTN.removeAttribute("disabled");
    }
    
    genererItems();


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

materielButton.click();