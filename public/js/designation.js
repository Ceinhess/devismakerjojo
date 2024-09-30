import {materiel, getMaterialsIDs, getMaterielByID} from "./materiel.js";


const reponse = await fetch('/data/designation.json');
export let designation = await reponse.json();

// Check si chaque materiels dans les designations existe bien
verifyAllDesignations();


// Verifie que toutes les designations sont valides
function verifyAllDesignations() {
    const listeMatIDs = getMaterialsIDs();
    for(let i = designation.length - 1; i >= 0; i--)
    {
        verifyDesignation(designation[i], listeMatIDs);
    }

    saveDesignation();
}

// Verifie qu'une designation est valide (chaque materiel dedans existe bien)
function verifyDesignation(des, listeMatIDs = getMaterialsIDs()) {
    for(let i = des.materiels.length - 1; i >= 0; i--)
    {
        if(!listeMatIDs.includes(des.materiels[i].id))
        {
            console.log("SUPPRIME DE DESIGNATION "+ des.nom + ": " + des.materiels[i].id);
            
            des.materiels.splice(i, 1);
        }
    }
}

export function getSelectedDesignation() {
    try
    {
        return getDesignationByID(document.querySelector(".designation-item-selected").dataset.id)
    }
    catch(e) {
        return null;
    }
}

export function getDesignationByID(id) {
    return designation.find(function(item, i){
        if(item.id == id) return item;
    })
}

export function genererDesignations(designation) {
    for (let i = 0; i < designation.length; i++) {
        //constante pour la designation actuelle
        const article = designation[i];

        const sectionItems = document.querySelector(".menu-items");

        // Création d'une balise pour la designation
        const designationElement = document.createElement("article");
        designationElement.dataset.id = designation[i].id;
        designationElement.classList.add('designation-item', 'p-1');
        
        // balise nom
        const nomElement = document.createElement("h4");
        nomElement.innerText = article.nom;
        nomElement.classList.add('designation-item-nom', 'user-select-none');

        // ajout au DOM
        sectionItems.appendChild(designationElement);
        designationElement.appendChild(nomElement);
        

        const containerMateriels = document.createElement("div");
        containerMateriels.classList.add("designation-item-container-materiels","d-flex", "flex-column", "m-0", "overflow-auto")


        designationElement.appendChild(containerMateriels);

        // boucle pour chaque materiel dans la designation
        for(let j = 0; j < article.materiels.length; j++)
        {
            //constante pour le materiel actuel
            const materielCible = materiel.find(x => x.id == article.materiels[j].id);

            
            // Si un materiel n'est plus present dans la liste, le supprime de la designation
            if(materielCible == undefined ) {
                designation[i].materiels.splice(designation[i].materiels.indexOf(article.materiels[j].id));
            } else {
                // balise nom materiel
                const materielElement = document.createElement("p");
                materielElement.innerText = materielCible.nom + " x" + article.materiels[j].quantite;
                materielElement.classList.add('designation-item-materiel', 'user-select-none', 'mt-0', 'mt-1', 'ms-2', 'overflow-none');
                materielElement.dataset.id = article.materiels[j].id;

                // ajout au DOM
                containerMateriels.appendChild(materielElement);
            }
        }
    }
}

export function getDesPrix(desID) {
    const des = getDesignationByID(desID);

    let prixTotal = 0;
    des.materiels.forEach(element => {
        prixTotal += +getMaterielByID(element.id).prix;
        
    });

    prixTotal = Math.round(prixTotal * 100) / 100

    return prixTotal
}

function updateProprietes() {
    const prixList = document.querySelectorAll('.proprietes-mat-prix');

    let prixTotal = 0;
    prixList.forEach(element => {
        prixTotal += +element.getAttribute("value");
        
    });

    prixTotal = Math.round(prixTotal * 100) / 100

    document.querySelector(".proprietes-prix-total").innerHTML = "Prix total: " + prixTotal + " €";
}

function updateProprieteMat(matElement, matData) {
    const quantite = +matElement.querySelector(".proprietes-mat-quantite").value;
    const prixElement = matElement.querySelector(".proprietes-mat-prix");

    prixElement.innerHTML = isNaN(quantite) ? "PRIX INVALIDE" : (quantite == 1 ? matData.prix + " €" : Math.round(quantite * matData.prix * 100)/100 + " € ("+matData.prix+"€/u)");
    prixElement.setAttribute("value", Math.round(quantite * matData.prix * 100)/100);

    updateProprietes();

}

export function genererProprietesDesignation(des) {
    const proprietesContainer = document.querySelector(".proprietes-element-container");

    if (des == null) {
        proprietesContainer.innerHTML = "";

        const proprietesElementTitre = document.createElement("h5");
        proprietesElementTitre.classList.add("proprietes-element-titre");
        proprietesElementTitre.innerHTML = "Selectionnez une désignation.";

        proprietesContainer.appendChild(proprietesElementTitre);

        return;
    }

    proprietesContainer.innerHTML = "";

    // Cree le titre (nom du materiel selectionné)
    const proprietesElementTitre = document.createElement("h5");
    proprietesElementTitre.classList.add("proprietes-element-titre");
    proprietesElementTitre.innerHTML = des.nom;

    // Cree le formulaire permettant la modification des proprietes
    const proprietesElementForm = document.createElement("form");
    proprietesElementForm.classList.add("proprietes-element-form", "form", "d-flex", "flex-column", "gap-1", "h-75");

    // ajoute le titre et le formulaire au DOM
    proprietesContainer.appendChild(proprietesElementTitre);
    proprietesContainer.appendChild(proprietesElementForm);

    //              ### FORMULAIRE ###
    // Label nom du materiel
    const proprietesElementFormNomLabel = document.createElement("p");
    proprietesElementFormNomLabel.innerHTML = "Nom:"
    proprietesElementFormNomLabel.classList.add("m-0", "mt-2");

    // Champs du nom du materiel
    const proprietesElementFormNom = document.createElement("input");
    proprietesElementFormNom.setAttribute("type", "text");
    proprietesElementFormNom.setAttribute("name", "proprietes-nom");
    proprietesElementFormNom.value = des.nom;

    // Conteneur section materiel (conteneur liste + bouton + total)
    const proprietesWrapperMateriel = document.createElement("div");
    proprietesWrapperMateriel.classList.add("d-flex", "flex-column", "p-2", "border-light", "proprietes-mat-wrapper", "mt-2", "rounded-1");

    // Conteneur liste materiels
    const proprietesContainerMateriel = document.createElement("div");
    proprietesContainerMateriel.classList.add("d-flex", "flex-column", "p-2", "border-light", "proprietes-mat-container", "mt-2", "rounded-1");

    

    // Pour chaque materiel contenus dans la designation
    des.materiels.forEach(mat => {

        proprietesContainerMateriel.appendChild(makePropMatElement(mat));

    });


    // prix total
    const proprietesPrixTotal = document.createElement("p");
    proprietesPrixTotal.classList.add("proprietes-prix-total")
    proprietesPrixTotal.innerHTML = "Prix total: " + 0 + " €";

    // Bouton modifier materiels
    const proprietesModifButton = document.createElement("button");
    proprietesModifButton.setAttribute("type", "button");
    proprietesModifButton.classList.add("btn", "btn-primary", "proprietes-btn-modif", "mt-2");
    proprietesModifButton.innerHTML = "Ajouter materiel";


    // Bouton submit
    const proprietesElementFormSubmit = document.createElement("button");
    proprietesElementFormSubmit.setAttribute("type", "submit");
    proprietesElementFormSubmit.classList.add("btn", "btn-primary", "proprietes-btn-submit", "mt-4");
    proprietesElementFormSubmit.innerHTML = "Enregistrer";

    // Bouton Supprimer
    const proprietesElementFormSuppr = document.createElement("button");
    proprietesElementFormSuppr.setAttribute("type", "button");
    proprietesElementFormSuppr.classList.add("btn", "btn-danger", "proprietes-btn-suppr", "mt-2");
    proprietesElementFormSuppr.innerHTML = "Supprimer";
    

    // Ajoute les elements au form dans le DOM
    proprietesElementForm.appendChild(proprietesElementFormNomLabel);
    proprietesElementForm.appendChild(proprietesElementFormNom);

    proprietesWrapperMateriel.appendChild(proprietesContainerMateriel)
    proprietesWrapperMateriel.appendChild(proprietesPrixTotal);
    proprietesWrapperMateriel.appendChild(proprietesModifButton);
    proprietesElementForm.appendChild(proprietesWrapperMateriel);

    proprietesElementForm.appendChild(proprietesElementFormSubmit);
    proprietesElementForm.appendChild(proprietesElementFormSuppr);

    updateProprietes();

}

function makePropMatElement(mat) {
    // Div globale contenant le materiel
    const matElementContainer = document.createElement("div");
    matElementContainer.classList.add("d-flex", "flex-column", "p-1", "border");
    matElementContainer.setAttribute("id", mat.id)

    // Données du materiel (dans la liste de tous les materiels, pas spécifique à cette désignation)
    const matData = getMaterielByID(mat.id);

    // nom
    const matElementNom = document.createElement("p");
    matElementNom.classList.add("m-1");
    matElementNom.innerHTML = matData.nom;

    // div quantite
    const matElementQuantiteContainer = document.createElement("div");
    matElementQuantiteContainer.classList.add("d-flex", "flex-row", "p-1", "mt-2", "gap-2");

    // - materiel
    const matElementQuantiteMoins = document.createElement("button");
    matElementQuantiteMoins.setAttribute("type", "button");
    matElementQuantiteMoins.classList.add("btn", "btn-secondary", "proprietes-btn-mat-moins");
    matElementQuantiteMoins.innerHTML = "-";

    // quantite
    const matElementQuantite = document.createElement("input");
    matElementQuantite.setAttribute("type", "number");
    matElementQuantite.setAttribute("min", 0);
    matElementQuantite.setAttribute("step", 1);
    matElementQuantite.setAttribute("name", "proprietes-mat-"+mat.id+"-quantite");
    matElementQuantite.classList.add("p-0", "form-control", "text-center", "proprietes-mat-quantite")
    matElementQuantite.value = mat.quantite;

    

    // + materiel
    const matElementQuantitePlus = document.createElement("button");
    matElementQuantitePlus.setAttribute("type", "button");
    matElementQuantitePlus.classList.add("btn", "btn-secondary", "proprietes-btn-mat-plus");
    matElementQuantitePlus.innerHTML = "+";

    // ajout a la div quantite
    //matElementQuantiteContainer.appendChild(matElementQuantiteMoins);
    matElementQuantiteContainer.appendChild(matElementQuantite);
    //matElementQuantiteContainer.appendChild(matElementQuantitePlus);

    // prix materiel
    const matElementPrix = document.createElement("p");
    matElementPrix.classList.add("m-1", "text-end", "proprietes-mat-prix");
    matElementPrix.innerHTML = mat.quantite == 1 ? matData.prix + " €" : mat.quantite * matData.prix + " € ("+matData.prix+"€/u)";
    matElementPrix.setAttribute("value", Math.round(mat.quantite * matData.prix * 100)/100);
    
    matElementContainer.appendChild(matElementNom);
    matElementContainer.appendChild(matElementQuantiteContainer);
    matElementContainer.appendChild(matElementPrix);

    matElementQuantite.addEventListener("change", function(event) {
        updateProprieteMat(matElementContainer, matData);
    });

    return matElementContainer;
}

// ---------- FONCTIONS FICHIERS --------------

export async function addMatToDesignation(mat, des) {
    const newMat = {
        "id": mat.id,
        "quantite": 1
    }

    des.materiels.push(newMat);

    document.querySelector(".proprietes-mat-container").appendChild(makePropMatElement(newMat));


}

export async function saveDesignation() {
    await fetch("writeDesignations", 
    {
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(designation)
    });
}

export async function addDesignation(des) {
    const newDes = {
        "id": designation.map(x => +x.id).reduce((a, b) => a > b ? a : b, 0) + 1,
        "nom": des.get("nom-add-designation"),
        "materiels": []
    }

    designation.push(newDes)

    saveDesignation();
}

export async function changeDesignation(des, event) {
    event.preventDefault();
    
    const data = new FormData(event.target);

    des.nom = data.get("proprietes-nom");

    for(let i = des.materiels.length - 1; i >= 0; i-- )
    {
        let mat = des.materiels[i];

        const quantite = +data.get("proprietes-mat-"+mat.id+"-quantite")
        if(quantite > 0)
            mat.quantite = quantite;
        else
            des.materiels.splice(i, 1);
    }

    saveDesignation();
}

export async function deleteDesignation(des) {
    designation.splice(designation.findIndex(d => d.id == des), 1);
    
    saveDesignation();
}