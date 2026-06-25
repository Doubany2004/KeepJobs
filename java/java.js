const bouttonAjouter = document.getElementById("bouttonAjouter");
const formulaire=document.getElementById("formulaireRenitialisation")
if(bouttonAjouter){
bouttonAjouter.addEventListener("click", ajouterJob);

formulaire.reset();

 
}

// fonction ajouter un element 
function ajouterJob(event){
    event.preventDefault();

    const entreprise = document.getElementById("entreprise").value;
    const poste = document.getElementById("poste").value;
    const date = document.getElementById("date").value;
    const statut = document.getElementById("statut").value;
    const lieu = document.getElementById("lieu").value;
    const note = document.getElementById("note").value;
    

    const entrepriseOublie = document.getElementById("entrepriseOublie");
    const posteOublie = document.getElementById("posteOublie");
    const dateOublie = document.getElementById("dateOublie");
    const statutOublie = document.getElementById("statutOublie");
    const lieuOublie = document.getElementById("lieuOublie");
    let erreur=false;
    

    // Réinitialiser les messages d'erreur
    entrepriseOublie.innerText = "";
    posteOublie.innerText = "";
    dateOublie.innerText = "";
    statutOublie.innerText = "";
    lieuOublie.innerText = "";

    // Réinitialiser les classes
    entrepriseOublie.classList.remove("oublie");
    posteOublie.classList.remove("oublie");
    dateOublie.classList.remove("oublie");
    statutOublie.classList.remove("oublie");
    lieuOublie.classList.remove("oublie");

    if (entreprise.trim() === "") {
        entrepriseOublie.classList.add("oublie");
        entrepriseOublie.innerText = "Vous devez écrire le nom de l'entreprise";
        erreur=true;
    }
    if (poste.trim() === "") {
        posteOublie.classList.add("oublie");
        posteOublie.innerText = "Vous devez écrire le poste auquel vous avez postulé";
         erreur=true;
    }
    if (date.trim() === "") {
        dateOublie.classList.add("oublie");
        dateOublie.innerText = "Vous devez écrire la date";
         erreur=true;
    }
    if (statut.trim() === "") {
        statutOublie.classList.add("oublie");
        statutOublie.innerText = "Vous devez choisir un statut";
         erreur=true;
    }
    if (lieu.trim() === "") {
        lieuOublie.classList.add("oublie");
        lieuOublie.innerText = "Vous devez indiquer le lieu ou se trouve l'entreprise";
         erreur=true;
    }

    if(erreur){
return;
    }


    const job = {
        id:Date.now(),
        entreprise,
        poste,
        date,
        statut,
        lieu,
        note,
        logo: entreprise.trim().charAt(0).toUpperCase()
        
    };

    console.log(job);

      // creation d'un stockage de panier dans le navigateur
    const Panier=JSON.parse(localStorage.getItem("panier")) || [];
Panier.push(job);
// afficher les texte dans le navigateur
localStorage.setItem("panier", JSON.stringify(Panier));
const nombreJob=document.getElementById("nombreJob");
        nombreJob.innerText=Panier.length;
        window.location.href = "mesJobs.html";
}
const zoneAffichageJob=document.getElementById("zoneAffichageJob")
if(zoneAffichageJob){
    affichageJob()
}

function affichageJob(){
    
    const panier=JSON.parse(localStorage.getItem("panier")) || []

zoneAffichageJob.innerHTML = ""; // IMPORTANT : vider l'affichage
if(panier.length === 0){
    zoneAffichageJob.classList.add("panier-vide");
    zoneAffichageJob.innerText="Vous n'avez ajouter aucun job"
  
}
else{
    
    for(let i=0; i<panier.length; i++){
        // creer un div pour chaque produit commet il vont etre afficher
        const item=document.createElement("div");
       

         item.classList.add("job-item");

            item.innerHTML = `
            <div class="item">
             <div class="logo">
               <a href="detailJob.html?id=${panier[i].id}" class="lienJob">${panier[i].logo}</a>
               </div>
        
               <div class="item1">
               <div>
                 <strong class ="entrepriseJob"> ${panier[i].entreprise}</strong>
               </div>
               <div class="posteJob">
               ${panier[i].poste}
               </div>
                <div class="posteDate">
               ${panier[i].date}
            </div>
            </div>
               
               
`;

            zoneAffichageJob.appendChild(item);

            


}

}


}

const nombreJob = document.getElementById("nombreJob");
if (nombreJob) {
    const panier = JSON.parse(localStorage.getItem("panier")) || [];
    nombreJob.innerText = panier.length;
}
