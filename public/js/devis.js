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

genererListeFichiersDevis();