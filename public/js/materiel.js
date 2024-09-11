export let materiel = null //window.localStorage.getItem('materiel');

if (materiel === null) {
    // Récupération des pièces depuis l'API
    const reponse = await fetch('/data/materiel.json');
    materiel = await reponse.json();
    // Transformation des pièces en JSON
    const valeurmateriel = JSON.stringify(materiel);
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("materiel", valeurmateriel);
} else {
    materiel = JSON.parse(materiel);
}

const sectionItems = document.querySelector(".menu-items");

export function genererMateriel(mat) {
    sectionItems.innerHTML = "";
    
    for (let i = 0; i < mat.length; i++) {

        const article = mat[i];
        // Récupération de l'élément du DOM qui accueillera les fiches
        const sectionItems = document.querySelector(".menu-items");

        // Création d’une balise dédiée à une pièce automobile
        const materielElement = document.createElement("article");
        materielElement.dataset.id = mat[i].id;
        materielElement.classList.add('materiel-item');
        materielElement.classList.add('p-1');
        // Création des balises 

        const nomElement = document.createElement("h4");
        nomElement.innerText = article.nom;
        nomElement.classList.add('materiel-item-nom');

        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${article.prix} €`;
        prixElement.classList.add('materiel-item-prix');

        // On rattache la balise article a la section Fiches
        sectionItems.appendChild(materielElement);
        materielElement.appendChild(nomElement);
        materielElement.appendChild(prixElement);

    }
}

export function addMateriel(mat) {
    console.log(mat);
    
    const newMat = {
        "id": materiel.map(x => +x.id).reduce((a, b) => a > b ? a : b, 0) + 1,
        "nom": mat.get("nom-add-materiel"),
        "prix": +parseFloat(mat.get("prix-add-materiel"))
    }

    materiel.push(newMat)
    genererMateriel(materiel);

    fetch("writeMateriels", 
    {
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(materiel)
    });

}

genererMateriel(materiel);