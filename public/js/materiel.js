// Récupération du materiel
const reponse = await fetch('/data/materiel.json');
export let materiel = await reponse.json();

export function getMaterielByID(id) {
    return materiel.find(function(item, i){
        if(item.id == id) return item;
    })
}

export function getMaterialsIDs() {
    let listeIDs = [];
    materiel.forEach(element => {
        listeIDs.push(element.id);
    });
    return listeIDs;
}

export function genererMateriel(mat = materiel) {
    for (let i = 0; i < mat.length; i++) {

        const article = mat[i];

        const sectionItems = document.querySelector(".menu-items");

        // Cree l'element parent 
        const materielElement = document.createElement("article");
        materielElement.dataset.id = mat[i].id;
        materielElement.classList.add('materiel-item');
        materielElement.classList.add('p-1');

        // Cree nom et prix 
        const nomElement = document.createElement("h4");
        nomElement.innerText = article.nom;
        nomElement.classList.add('materiel-item-nom', 'user-select-none');

        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${article.prix} €`;
        prixElement.classList.add('materiel-item-prix', 'user-select-none');

        // Ajout au DOM
        sectionItems.appendChild(materielElement);
        materielElement.appendChild(nomElement);
        materielElement.appendChild(prixElement);
    }
}

export function genererProprietesMateriel(mat) {
    const proprietesContainer = document.querySelector(".proprietes-element-container");

    if (mat == null) {
        proprietesContainer.innerHTML = "";

        const proprietesElementTitre = document.createElement("h5");
        proprietesElementTitre.classList.add("proprietes-element-titre");
        proprietesElementTitre.innerHTML = "Selectionnez un matériel.";

        proprietesContainer.appendChild(proprietesElementTitre);

        return;
    }

    proprietesContainer.innerHTML = "";

    // Cree le titre (nom du materiel selectionné)
    const proprietesElementTitre = document.createElement("h5");
    proprietesElementTitre.classList.add("proprietes-element-titre");
    proprietesElementTitre.innerHTML = mat.nom;

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
    proprietesElementFormNom.value = mat.nom;

    // Label prix du materiel
    const proprietesElementFormPrixLabel = document.createElement("p");
    proprietesElementFormPrixLabel.innerHTML = "Prix:";
    proprietesElementFormPrixLabel.classList.add("m-0", "mt-2");
    
    // Champs du prix du materiel
    const proprietesElementFormPrix = document.createElement("input");
    proprietesElementFormPrix.setAttribute("type", "number");
    proprietesElementFormPrix.setAttribute("name", "proprietes-prix");
    proprietesElementFormPrix.setAttribute("step", "0.01");
    proprietesElementFormPrix.setAttribute("min", "0");
    proprietesElementFormPrix.value = mat.prix;



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
    proprietesElementForm.appendChild(proprietesElementFormPrixLabel);
    proprietesElementForm.appendChild(proprietesElementFormPrix);
    proprietesElementForm.appendChild(proprietesElementFormSubmit);
    proprietesElementForm.appendChild(proprietesElementFormSuppr);
}

// ---------- FONCTIONS FICHIERS --------------

export async function saveMateriel() {
    await fetch("writeMateriels", 
    {
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(materiel)
    });
}

export async function addMateriel(mat) {
    const newMat = {
        "id": materiel.map(x => +x.id).reduce((a, b) => a > b ? a : b, 0) + 1,
        "nom": mat.get("nom-add-materiel"),
        "prix": +parseFloat(mat.get("prix-add-materiel"))
    }

    materiel.push(newMat);

    saveMateriel();
}

export async function changeMateriel(mat, event) {
    event.preventDefault();
    
    const data = new FormData(event.target);

    mat.nom = data.get("proprietes-nom");
    mat.prix = data.get("proprietes-prix");

    saveMateriel();
}

export async function deleteMateriel(mat) {
    materiel.splice(materiel.findIndex(m => m.id == mat), 1);
    saveMateriel();
}

