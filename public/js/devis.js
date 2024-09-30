import {getDesignationByID, getDesPrix} from "./designation.js";

export let devis = {
    fichier: "",
    client: "",
    adresse: "",
    mail: "",
    telephone:"",
    date:0,
    numDevis:"",
    type:"",

    accompte:0,
    tva:0,
    validiteDate:0,

    designations: []
}

export function genererListeFichiersDevis() {
    const listeDevisSelect = document.querySelector(".charger-devis-select");

    fetch("getListeDevis", {method:"POST"})
        .then(res => {
            return res.json() } )
        .then(jsonData  => {
            listeDevisSelect.innerHTML = "";
            jsonData.forEach(file => {
                const selectOption = document.createElement("option");
                selectOption.dataset.value = file;
                selectOption.innerHTML = file;

                listeDevisSelect.appendChild(selectOption);
            });
        });
}

export function genererChampsDevis(newDevis) {
    devis = newDevis;

    document.querySelector("input[name='nom-fichier']").value = devis["fichier"];

    document.querySelector("input[name='client']").value = devis["client"];
    document.querySelector("input[name='client-adresse']").value = devis["adresse"];
    document.querySelector("input[name='client-mail']").value = devis["mail"];
    document.querySelector("input[name='client-num']").value = devis["telephone"];
    document.querySelector("input[name='date-devis']").value = devis["date"];
    document.querySelector("input[name='num-devis']").value = devis["numDevis"];
    
    document.querySelector("input[id="+devis["type"]+"]").checked = true;
    document.querySelector("input[id="+devis["accompte"]+"]").checked = true;
    document.querySelector("input[id="+devis["tva"]+"]").checked = true;
    document.querySelector("input[name='date-validite-devis']").value = devis["validiteDate"];



    console.log(devis);
    

}

export function genererElementDesignationDevis(desID, devisDesID) {

    const des = getDesignationByID(desID)

    const prixDes = getDesPrix(desID);

    // Cree div englobante
    const desContainer = document.createElement("div");
    desContainer.classList.add('des-container', 'd-flex', 'flex-column', 'p-1', 'gap-1', "border-bottom", "border", "border-dark");

    // Cree premiere ligne (nom + quantite)
    const lineOne = document.createElement("div");
    lineOne.classList.add('d-flex', "border-bottom");

    // Cree seconde ligne (prix/unite/total)
    const lineTwo = document.createElement("div");
    lineTwo.classList.add('d-flex', "border-bottom");

    // Cree troisieme ligne (HT/champs/champs)
    const lineThree = document.createElement("div");
    lineThree.classList.add('d-flex');

    // Cree quatrieme ligne (TVA+MO(champs)/champs/champs)
    const lineFour = document.createElement("div");
    lineFour.classList.add('d-flex', "border-bottom");

    // Cree Cinquieme ligne, outils (supprimer/bouger ^/bouger v)
    const lineFive = document.createElement("div");
    lineFive.classList.add('d-flex');
    
    desContainer.appendChild(lineOne);
    desContainer.appendChild(lineTwo);
    desContainer.appendChild(lineThree);
    desContainer.appendChild(lineFour);
    desContainer.appendChild(lineFive);

    //    -------------------------------------LIGNE UN
    const nom = document.createElement("p");
    nom.innerHTML = des.nom; 
    nom.classList.add("col-6", "m-0")

    const quantite = document.createElement("input");
    quantite.setAttribute("type", "number");
    quantite.setAttribute("min", 0);
    quantite.setAttribute("step", 1);
    quantite.setAttribute("name", "devis-des-"+devisDesID+"-quantite");
    quantite.classList.add("col-6","p-0", "form-control", "text-center", "devis-des-quantite", "w-50")
    quantite.value = 1;

    lineOne.appendChild(nom);
    lineOne.appendChild(quantite);

    //    -------------------------------------LIGNE DEUX
    const prixTexte = document.createElement("p");
    prixTexte.innerHTML = "PRIX:"; 
    prixTexte.classList.add("col-4", "m-0")

    const uniteTexte = document.createElement("p");
    uniteTexte.innerHTML = "Unité:"; 
    uniteTexte.classList.add("col-4", "text-center", "m-0")

    const totalTexte = document.createElement("p");
    totalTexte.innerHTML = "Total:"; 
    totalTexte.classList.add("col-4", "text-center", "m-0")

    lineTwo.appendChild(prixTexte);
    lineTwo.appendChild(uniteTexte);
    lineTwo.appendChild(totalTexte);

    //    -------------------------------------LIGNE TROIS
    const HTTexte = document.createElement("p");
    HTTexte.innerHTML = "Hors-Taxes:"; 
    HTTexte.classList.add("col-4", "m-0", "border-end")

    const prixHT = document.createElement("p");
    prixHT.innerHTML = prixDes; 
    prixHT.classList.add("col-4", "text-center", "m-0", "border-end")

    const prixTotalHT = document.createElement("p");
    prixTotalHT.innerHTML = prixDes * quantite.value; 
    prixTotalHT.classList.add("col-4", "text-center", "m-0")

    lineThree.appendChild(HTTexte);
    lineThree.appendChild(prixHT);
    lineThree.appendChild(prixTotalHT);

    //    -------------------------------------LIGNE QUATRE
    const divMainOeuvre = document.createElement("div");
    divMainOeuvre.classList.add("col-4", "d-flex", "m-0")

    const MOTexte = document.createElement("p");
    MOTexte.innerHTML = "Main d'oeuvre:"
    MOTexte.classList.add("m-0");

    const MOMulti = document.createElement("input");
    MOMulti.setAttribute("type", "number");
    MOMulti.setAttribute("min", 1);
    MOMulti.setAttribute("step", 0.01);
    MOMulti.setAttribute("name", "devis-des-"+devisDesID+"-MOMulti");
    MOMulti.classList.add("p-0", "form-control", "text-center", "devis-des-MO", "col-2", "w-50")
    MOMulti.value = 1.5;

    divMainOeuvre.appendChild(MOTexte);
    divMainOeuvre.appendChild(MOMulti);

    const prixMO = document.createElement("p");
    prixMO.innerHTML = prixDes * MOMulti.value;
    prixMO.setAttribute("name", "devis-des-"+devisDesID+"-MO");
    prixMO.classList.add("col-4", "text-center", "m-0", "align-text-middle", "align-self-center")


    const prixTotalMO = document.createElement("input");
    prixTotalMO.setAttribute("type", "number");
    prixTotalMO.setAttribute("min", 1);
    prixTotalMO.setAttribute("step", 0.01);
    prixTotalMO.setAttribute("name", "devis-des-"+devisDesID+"-MOTotal");
    prixTotalMO.classList.add("p-0", "form-control", "text-end", "devis-des-MO", "col-1", "w-25")
    prixTotalMO.value = prixDes * MOMulti.value * quantite.value;


    lineFour.appendChild(divMainOeuvre);
    lineFour.appendChild(prixMO);
    lineFour.appendChild(prixTotalMO);

    //    -------------------------------------LIGNE CINQ


    




    return desContainer;
}

export function addDesToDevis(desID) {
    
    const des = getDesignationByID(desID);

    let desDevisID = 0;

    if(devis.designations != []) {
        desDevisID = devis.designations.map(x => +x.id).reduce((a, b) => a > b ? a : b, 0) + 1;
    }

    const desDevisItem = 
    {
        "id": desDevisID,
        "desId" : desID,
        "quantite": 1,
        "mo":1.5
    }

}


genererListeFichiersDevis();