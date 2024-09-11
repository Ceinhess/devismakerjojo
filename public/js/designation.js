import {materiel} from "./materiel.js";

export let designation = null //window.localStorage.getItem('designation');

if (designation === null) {
    // Récupération des pièces depuis l'API
    const reponse = await fetch('/data/designation.json');
    designation = await reponse.json();
    // Transformation des pièces en JSON
    const valeurDesignations = JSON.stringify(designation);
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("designation", valeurDesignations);
} else {
    designation = JSON.parse(designation);
}


export function genererDesignations(designation) {
    // Récupération de l'élément du DOM qui accueillera les fiches
    const sectionItems = document.querySelector(".menu-items");

    for (let i = 0; i < designation.length; i++) {
        //constante pour la designation actuelle
        const article = designation[i];

        // Création d'une balise pour la designation
        const designationElement = document.createElement("article");
        designationElement.dataset.id = designation[i].id;
        designationElement.classList.add('designation-item');
        designationElement.classList.add('p-1');
        
        // balise nom
        const nomElement = document.createElement("h4");
        nomElement.innerText = article.nom;
        nomElement.classList.add('designation-item-nom');

        // ajout au DOM
        sectionItems.appendChild(designationElement);
        designationElement.appendChild(nomElement);

        // boucle pour chaque materiel dans la designation
        for(let i = 0; i < article.materiels.length; i++)
            {
                //constante pour le materiel actuel
                const materielCible = materiel.find(x => x.id == article.materiels[i]);

                // balise nom materiel
                const materielElement = document.createElement("p");
                materielElement.innerText = materielCible.nom;
                materielElement.classList.add('designation-item-materiel');
                materielElement.dataset.id = article.materiels[i].id;

                // ajout au DOM
                designationElement.appendChild(materielElement);
            }

    }
}
