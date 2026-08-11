
// importation des modules Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// importation des modules Firebase pour l'authentification et la base de données
import { getAuth ,
     createUserWithEmailAndPassword,
     signInWithEmailAndPassword ,
     onAuthStateChanged,
     signOut,

} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";



const firebaseConfig = {
  apiKey: "AIzaSyCooUQO0d0Y1_WhB64OfznNFhmwSmsJDM8",
  authDomain: "keepjobs-ed1ad.firebaseapp.com",
  projectId: "keepjobs-ed1ad",
  storageBucket: "keepjobs-ed1ad.firebasestorage.app",
  messagingSenderId: "856827995914",
  appId: "1:856827995914:web:14972f444557b52ec37cf3",
  measurementId: "G-ZBXBWZ9DX4"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
// Récupération des instances d'authentification et de Firestore
const auth = getAuth(app);
// Récupération de l'instance Firestore comme base de données pour stocker 
// les informations supplémentaires des utilisateurs
const db = getFirestore(app);
 
// Clé de stockage par utilisateur (panier_<uid>) ou guest
function getPanierKey() {
    try {
        const user = auth.currentUser;
        return user ? `panier_${user.uid}` : `panier_guest`;
    } catch (e) {
        return `panier_guest`;
    }
}

function getStoredPanier() {
    const key = getPanierKey();
    const panier = JSON.parse(localStorage.getItem(key)) || [];

    // Pour un utilisateur connecté, on ne doit lire que sa clé.
    // Pour un invité, on garde le fallback vers les clés historiques guest/legacy.
    if (auth.currentUser) {
        return panier;
    }

    if (panier.length > 0) {
        return panier;
    }

    const legacyPanier = JSON.parse(localStorage.getItem("panier")) || [];
    if (legacyPanier.length > 0) {
        return legacyPanier;
    }

    return JSON.parse(localStorage.getItem("panier_guest")) || [];
}

function getJobById(id) {
    const panier = getStoredPanier();
    const job = panier.find(j => j.id == id);
    if (job) return job;

    // Si le job n’est pas dans le panier courant, on cherche uniquement sur les clefs panier_*
    // afin d’éviter de retourner des jobs d’un autre utilisateur par erreur.
    for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i);
        if (!storageKey || !storageKey.startsWith("panier")) continue;
        const otherPanier = JSON.parse(localStorage.getItem(storageKey)) || [];
        const found = otherPanier.find(j => j.id == id);
        if (found) return found;
    }

    return null;
}

function updateNombreJobDisplay() {
    const nombreJob = document.getElementById("nombreJob");
    if (!nombreJob) return;
    const panier = getStoredPanier();
    nombreJob.innerText = panier.length;
}
 
// pour la creation d'un compte
const creationCompteBoutton = document.getElementById("bouttonCreationCompte");
if (creationCompteBoutton) {
    creationCompteBoutton.addEventListener("click", creerCompte);
}

function creerCompte(event) {
    event.preventDefault();

     const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;
    const profession = document.getElementById("profession").value;
    const email = document.getElementById("email").value;
    const mot_de_passe = document.getElementById("mot_de_passe").value;
    const confirmer_mot_de_passe = document.getElementById("confirmer_mot_de_passe").value;

    const erreurNom = document.getElementById("erreurNom");
    const erreurPrenom = document.getElementById("erreurPrenom");
    const erreurProfession = document.getElementById("erreurProfession");
    const erreurEmail = document.getElementById("erreurEmail");
    const erreurMotDePasse = document.getElementById("erreurMotDePasse");
    const erreurConfirmerMotDePasse = document.getElementById("erreurConfirmerMotDePasse");
    let erreurCreerCompte= false;

    // Réinitialiser les messages d'erreur
    erreurNom.innerText = "";
    erreurPrenom.innerText = "";
    erreurProfession.innerText = "";
    erreurEmail.innerText = "";
    erreurMotDePasse.innerText = "";
    erreurConfirmerMotDePasse.innerText = "";

     // Réinitialiser les classes
    erreurNom.classList.remove("oublie");
    erreurPrenom.classList.remove("oublie");
    erreurProfession.classList.remove("oublie");
    erreurEmail.classList.remove("oublie");
    erreurMotDePasse.classList.remove("oublie");
    erreurConfirmerMotDePasse.classList.remove("oublie");

if (nom.trim() === "") {
        erreurNom.classList.add("oublie");
        erreurNom.innerText = "Vous devez écrire votre nom";
        erreurCreerCompte=true;
    }
    if (prenom.trim() === "") {
        erreurPrenom.classList.add("oublie");
        erreurPrenom.innerText = "Vous devez écrire votre prénom";
        erreurCreerCompte=true;
    }
    if (profession.trim() === "") {
        erreurProfession.classList.add("oublie");
        erreurProfession.innerText = "Vous devez écrire votre profession";
        erreurCreerCompte=true;
    }

// Vérifie que l'email contient @ et .
if (!email.includes("@") || !email.includes(".")) {
    erreurEmail.classList.add("oublie");
    erreurEmail.innerText = "Vous devez utilisez un email valide ex: email200@gmail.com";
    erreurCreerCompte = true;
}


// Séparer les parties de l'email
const parts = email.split("@");

// Vérifier qu'il y a quelque chose avant le @
if (parts[0].trim().length === 0) {
    erreurEmail.classList.add("oublie");
    erreurEmail.innerText = "Vous devez utilisez un email valide ex: email200@gmail.com";
    erreurCreerCompte = true;
}

// Vérifier qu'il y a un domaine après le @
if (!parts[1]) {
    erreurEmail.classList.add("oublie");
    erreurEmail.innerText = "Vous devez utilisez un email valide ex: email200@gmail.com";
    erreurCreerCompte = true;
} else {

    const domainParts = parts[1].split(".");

    if (domainParts[0].trim().length === 0) {
        erreurEmail.classList.add("oublie");
        erreurEmail.innerText = "Vous devez utilisez un email valide ex: email200@gmail.com";
        erreurCreerCompte = true;
    }

    const extension = domainParts.pop().toLowerCase();

    const validExtensions = [
        "com","net","org","info","biz",
        "edu","io","co","me","tech","dev","app","tv",
        "ca","fr","us","uk","de","jp","br","mx"
    ];

    if (!validExtensions.includes(extension)) {
        erreurEmail.classList.add("oublie");
        erreurEmail.innerText = "Vous devez utilisez un email valide ex: email200@gmail.com";
        erreurCreerCompte = true;
    }
}


let motDePasseCorrect=false;
let motDePasseTropCourt=false;
let motDePasseSansMajuscule=true;
let motDePasseSansMinuscule=true;
let motDePasseSansChiffre=true;

if (mot_de_passe.trim().length < 8) {
    motDePasseTropCourt=true;
}
if (mot_de_passe.trim() !== mot_de_passe.trim().toLowerCase()) {
    motDePasseSansMajuscule=false;
}
if (mot_de_passe.trim() !== mot_de_passe.trim().toUpperCase()) {
    motDePasseSansMinuscule=false;
}
if (/[0-9]/.test(mot_de_passe.trim())) {
    motDePasseSansChiffre=false;
}

    if (!motDePasseTropCourt && !motDePasseSansMajuscule &&
         !motDePasseSansMinuscule && !motDePasseSansChiffre) {
        motDePasseCorrect=true;
        erreurMotDePasse.classList.add("motDePasseCorrect");
         erreurMotDePasse.innerText = "mot de passe correct";
    }

    if (!motDePasseCorrect) {
        erreurMotDePasse.classList.add("oublie");
        erreurMotDePasse.innerText = "votre mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre";
        erreurCreerCompte=true;
    }
   
   if (mot_de_passe.trim() !== confirmer_mot_de_passe.trim()) {
        erreurConfirmerMotDePasse.classList.add("oublie");
        erreurConfirmerMotDePasse.innerText = "Les mots de passe ne correspondent pas";
        erreurCreerCompte=true;
    }
if(erreurCreerCompte){
return;
    }

    // Création du compte avec Firebase Authentication
    // la fonction createUserWithEmailAndPassword crée un nouvel 
    // utilisateur avec l'email et le mot de passe fournis. Elle renvoie
    //  une promesse qui se résout avec un objet utilisateur si la création est
    //  réussie, ou rejette avec une erreur si elle échoue.
createUserWithEmailAndPassword(auth, email, mot_de_passe)
    .then((userCree) => {
        const user = userCree.user;
        const userData = {
            nom: nom,
            prenom: prenom,
            profession: profession,
            email: email,
            dateCreation: new Date().toISOString()
        };

        localStorage.setItem(`profil_${user.uid}`, JSON.stringify(userData));

        // Enregistrer les infos dans Firestore (ne bloque pas la redirection)
        setDoc(doc(db, "utilisateurs", user.uid), userData)
        .then(() => console.log("Infos utilisateur enregistrées en Firestore")) 
        .catch((e) => console.error("Erreur enregistrement Firestore:", e));

        console.log("Compte créé !");
        window.location.href = "connexionCompte.html"; // redirection vers la page de connexion
    })
    // Gestion des erreurs lors de la création du compte
    .catch((error) => {
        console.error("Erreur Firebase :", error.message);
        erreurEmail.classList.add("oublie");
        erreurEmail.innerText = "Cet email est déjà utilisé";
    
    });


}

// la page pour la connexion d'un compte
const bouttonConnexion = document.getElementById("bouttonConnexion");
if (bouttonConnexion) {
    bouttonConnexion.addEventListener("click", connexionCompte);
}
function connexionCompte(event) {
    event.preventDefault();
     const email = document.getElementById("email").value;
    const mot_de_passe = document.getElementById("mot_de_passe").value;
    const erreurMotDePasseEmail = document.getElementById("erreurMotDePasseEmail");
    erreurMotDePasseEmail.innerText = ""; // Réinitialiser le message d'erreur
    erreurMotDePasseEmail.classList.remove("oublie"); // Réinitialiser la classe d'erreur

    signInWithEmailAndPassword(auth, email, mot_de_passe)
    .then((userCree)=>{
console.log("Connexion réussie !");
window.location.href = "AjouteDeJobs.html"; // redirection vers la page mesJobs.html

    })
    .catch((error)=>{
        console.error("Erreur Firebase :", error.message);
        erreurMotDePasseEmail.classList.add("oublie");
        erreurMotDePasseEmail.innerText = "Email ou mot de passe incorrect";
    });
}

// Vérification de l'état de connexion de l'utilisateur
// Sécurité : vérifier si l'utilisateur est connecté
if (window.location.pathname.includes("AjouteDeJobs.html")) {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = "connexionCompte.html"; // redirection vers la page de connexion si l'utilisateur n'est pas connecté
        }
    });
}

// Rafraîchir l'affichage et le compteur quand l'état d'auth change
onAuthStateChanged(auth, (user) => {
    updateNombreJobDisplay();
    const zoneAffichageJob = document.getElementById("zoneAffichageJob");
    if (zoneAffichageJob && typeof affichageJob === 'function') affichageJob();
});


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
    const contrat= document.getElementById("contrat").value;
        const salaire= document.getElementById("salaire").value;
    

    const entrepriseOublie = document.getElementById("entrepriseOublie");
    const posteOublie = document.getElementById("posteOublie");
    const dateOublie = document.getElementById("dateOublie");
    const statutOublie = document.getElementById("statutOublie");
    const lieuOublie = document.getElementById("lieuOublie");
      const contratOublie = document.getElementById("contratOublie");
      const salaireOublie= document.getElementById("salaireOublie");
    let erreur=false;
    

    // Réinitialiser les messages d'erreur
    entrepriseOublie.innerText = "";
    posteOublie.innerText = "";
    dateOublie.innerText = "";
    statutOublie.innerText = "";
    lieuOublie.innerText = "";
    contratOublie.innerText = "";
    salaireOublie.innerText="";

    // Réinitialiser les classes
    entrepriseOublie.classList.remove("oublie");
    posteOublie.classList.remove("oublie");
    dateOublie.classList.remove("oublie");
    statutOublie.classList.remove("oublie");
    lieuOublie.classList.remove("oublie");
 contratOublie.classList.remove("oublie");
 salaireOublie.classList.remove("oublie");
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
      if (contrat.trim() === "") {
        contratOublie.classList.add("oublie");
        contratOublie.innerText = "Vous devez indiquer le type de contrat";
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
        contrat,
        salaire,
        logo: entreprise.trim().charAt(0).toUpperCase()
        
    };

    console.log(job);

      // creation d'un stockage de panier dans le navigateur
    const key = getPanierKey();
    const Panier = JSON.parse(localStorage.getItem(key)) || [];
    Panier.push(job);
    // afficher les texte dans le navigateur
    localStorage.setItem(key, JSON.stringify(Panier));
    updateNombreJobDisplay();
        window.location.href = "mesJobs.html";
}
const zoneAffichageJob=document.getElementById("zoneAffichageJob")
if(zoneAffichageJob){
    affichageJob()
    modalModifierSupprimer()
}

function affichageJob(){
    
    const panier = getStoredPanier();

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
                   <strong class="entrepriseJob">${panier[i].entreprise}</strong>
                 </div>

                 <div class="posteJob">${panier[i].poste}</div>
                 <div class="posteStatut ${panier[i].statut}">${panier[i].statut}</div>
                 <div class="posteDate">${panier[i].lieu}</div>
               </div>

               <button class="modalModifierSupprimer" data-id="${panier[i].id}" onclick="ouvrirModalAction('${panier[i].id}')">::</button>
            </div>

`;

            zoneAffichageJob.appendChild(item);

            


}

}


}

// Mettre à jour l'affichage du compteur au chargement
updateNombreJobDisplay();

// la page deatil des jobs
const zone = document.getElementById("zoneDetail");

if (zone) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const job = getJobById(id);

    if (!job) {
        zone.innerHTML = "<p>Job introuvable.</p>";
    } else {
        zone.innerHTML = `
       <div class="detailFinal">
       
      

<div class ="detail1"> 
<div class="detailTitre">Entreprise:</div>
<div >${job.entreprise}</div>
</div>

<div class ="detail1"> 
<div class="detailTitre">poste:</div>
<div >${job.poste}</div>
</div>

<div class ="detail1"> 

<div class="detailTitre">Type contrat:</div>
<div >${job.contrat}</div>
</div>
          

<div class ="detail1"> 

<div class="detailTitre ">Statut:</div>
<div class="detailStatut ${job.statut}">${job.statut}</div>
</div>

<div class ="detail1"> 

<div class="detailTitre">Contrat:</div>
<div >${job.contrat}</div>
</div>

<div class ="detail1"> 

<div class="detailTitre">Salaire:</div>
<div >${job.salaire || "Non indiqué"}</div>
</div>


<div class ="detail1"> 

<div class="detailTitre">Date de candidature:</div>
<div >${job.date}</div>
</div>


<div class ="detail1"> 

<div class="detailTitre">lieu:</div>
<div >${job.lieu}</div>
</div>

<div class ="detail1"> 
<div class="detailTitre">note:</div>
<div >  ${job.note || "<i>Aucune note</i>"}</div>
</div>
            
</div>
        `;
    }
}

window.ouvrirModalAction = function(idJob) {
    const modalAction = document.getElementById("modalAction");
    const modalConfirm = document.getElementById("modalConfirm");
    if (!modalAction || !modalConfirm) return;

    modalAction.dataset.id = idJob;
    modalAction.style.display = "flex";
    modalConfirm.style.display = "none";
    modalAction.classList.add("is-open");
    modalConfirm.classList.remove("is-open");
};

//la fonction modal pour modifier et supprimer les jobs
function modalModifierSupprimer(){

    let modalAction = document.getElementById("modalAction");
    let modalConfirm = document.getElementById("modalConfirm");

    if (!modalAction) {
        modalAction = document.createElement("div");
        modalAction.id = "modalAction";
        modalAction.classList.add("modal");
        modalAction.innerHTML = `
            <div class="modalContent">
                <button id="btnModifier" class="modalBtn">Modifier</button>
                <button id="btnSupprimer" class="modalBtndanger">Supprimer</button>
                <button id="closeModalActions" class="closeBtn">Fermer</button>
            </div>
        `;
        document.body.appendChild(modalAction);
    }

    if (!modalConfirm) {
        modalConfirm = document.createElement("div");
        modalConfirm.id = "modalConfirm";
        modalConfirm.classList.add("modalSupprimer");
        modalConfirm.innerHTML = `
            <div class="modalContent">
                <div>Voulez-vous supprimer ce job ?</div>
                <button id="confirmYes" class="modalBtndanger">Oui</button>
                <button id="confirmNo" class="closeBtn">Non</button>
            </div>
        `;
        document.body.appendChild(modalConfirm);
    }

    const closeModalActions = document.getElementById("closeModalActions");
    if (closeModalActions) {
        closeModalActions.onclick = () => {
            modalAction.style.display = "none";
        };
    }

    const btnSupprimer = document.getElementById("btnSupprimer");
    if (btnSupprimer) {
        btnSupprimer.onclick = () => {
            modalAction.style.display = "none";
            modalConfirm.style.display = "flex";
        };
    }

    const confirmNo = document.getElementById("confirmNo");
    if (confirmNo) {
        confirmNo.onclick = () => {
            modalConfirm.style.display = "none";
        };
    }

    const confirmYes = document.getElementById("confirmYes");
    if (confirmYes) {
        confirmYes.onclick = () => {
            const idJob = modalAction.dataset.id;
            const key = getPanierKey();
            const panier = JSON.parse(localStorage.getItem(key)) || [];
            const nouveauPanier = panier.filter(j => j.id != idJob);
            localStorage.setItem(key, JSON.stringify(nouveauPanier));
            window.location.href = "mesJobs.html";
        };
    }

    const btnModifier = document.getElementById("btnModifier");
    if (btnModifier) {
        btnModifier.onclick = () => {
            const idJob = modalAction.dataset.id;
            window.location.href = `modifierJob.html?id=${idJob}`;
        };
    }
}

const bouttonModifier = document.getElementById("bouttonModifier");

function setupModifierPage() {
    if (!bouttonModifier) return;
    modifierJob();
}

// fonction pour les modifications des jobs
function modifierJob() {

    // 1. Récupérer l’ID dans l’URL
    const params = new URLSearchParams(window.location.search);
    const idModifier = params.get("id");

    if (!idModifier) return;

    // 2. Charger les jobs depuis localStorage
    const panier = getStoredPanier();

    // 3. Trouver le job à modifier
    const job = panier.find(j => j.id == idModifier);

    // 4. Pré-remplir les champs
    if (job) {
        document.getElementById("entreprise").value = job.entreprise;
        document.getElementById("poste").value = job.poste;
        document.getElementById("date").value = job.date;
        document.getElementById("statut").value = job.statut;
        document.getElementById("lieu").value = job.lieu;
        document.getElementById("contrat").value = job.contrat;
        document.getElementById("salaire").value = job.salaire || "";
        document.getElementById("note").value = job.note || "";
    }

    // 5. Enregistrer les modifications
    bouttonModifier.addEventListener("click", (event) => {
        event.preventDefault();

        const index = panier.findIndex(j => j.id == idModifier);
        if (index === -1) return;

        panier[index].entreprise = document.getElementById("entreprise").value;
        panier[index].poste = document.getElementById("poste").value;
        panier[index].date = document.getElementById("date").value;
        panier[index].statut = document.getElementById("statut").value;
        panier[index].lieu = document.getElementById("lieu").value;
        panier[index].contrat = document.getElementById("contrat").value;
        panier[index].salaire = document.getElementById("salaire").value;
        panier[index].note = document.getElementById("note").value;

        localStorage.setItem(getPanierKey(), JSON.stringify(panier));

        // Mettre à jour l'affichage du compteur
        updateNombreJobDisplay();

        window.location.href = "mesJobs.html";
    });
}

onAuthStateChanged(auth, (user) => {
    updateNombreJobDisplay();
    const zoneAffichageJob = document.getElementById("zoneAffichageJob");
    if (zoneAffichageJob && typeof affichageJob === 'function') affichageJob();
    setupModifierPage();
});

// ouvrir le modal pour le profil la deconnexion et la suppression du compte
const boutonModal1 = document.getElementById("boutonModal1");
if (boutonModal1) {
    boutonModal1.addEventListener("click",ouvrirModal1);
}

function applyProfileData(data = {}) {
    const profilNom = document.getElementById("profilNom");
    const profilPrenom = document.getElementById("profilPrenom");
    const profilEmail = document.getElementById("profilEmail");
    const profilProfession = document.getElementById("profilProfession");

    const nom = data.nom || data.name || "";
    const prenom = data.prenom || data.firstName || "";
    const email = data.email || auth.currentUser?.email || "";
    const profession = data.profession || data.metier || "";

    if (profilNom) profilNom.innerText = nom;
    if (profilPrenom) profilPrenom.innerText = prenom;
    if (profilEmail) profilEmail.innerText = email;
    if (profilProfession) profilProfession.innerText = profession;
}

async function chargerProfilUtilisateur() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const docSnap = await getDoc(doc(db, "utilisateurs", user.uid));

        if (docSnap.exists()) {
            const data = docSnap.data() || {};
            applyProfileData(data);
            localStorage.setItem(`profil_${user.uid}`, JSON.stringify(data));
            return;
        }
    } catch (error) {
        console.error("Erreur lors du chargement du profil utilisateur:", error);
    }

    try {
        const profilLocal = JSON.parse(localStorage.getItem(`profil_${user.uid}`) || "null");
        if (profilLocal) {
            applyProfileData(profilLocal);
            return;
        }
    } catch (error) {
        console.error("Erreur lors de la lecture du profil local:", error);
    }

    applyProfileData({ email: user.email || "" });
}

function ouvrirModal1() {
    const modalProfil = document.getElementById("modalProfil");
    if (!modalProfil) return;
    modalProfil.style.display = "flex";
    chargerProfilUtilisateur();
}

const btnFermerProfil = document.getElementById("btnFermerProfil");
if (btnFermerProfil) {
    btnFermerProfil.addEventListener("click", () => {
        const modalProfil = document.getElementById("modalProfil");
        if (!modalProfil) return;
        modalProfil.style.display = "none";
    }); 
}

function creerModalDeconnexion() {
    const modal = document.createElement("div");
    modal.id = "modalConfirmDeconnexion";
    modal.className = "modalProfil";
    modal.style.display = "none";
    modal.innerHTML = `
        <div class="modalProfilContent">
            <h2>Déconnexion</h2>
            <p>Voulez-vous vraiment vous déconnecter ?</p>
            <button id="confirmDeconnexionOui" class="btnDanger">Oui</button>
            <button id="confirmDeconnexionNon" class="btnClose">Non</button>
        </div>
    `;
    document.body.appendChild(modal);

    const btnOui = document.getElementById("confirmDeconnexionOui");
    const btnNon = document.getElementById("confirmDeconnexionNon");

    if (btnOui) {
        btnOui.addEventListener("click", async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    localStorage.removeItem(`profil_${user.uid}`);
                }
                await signOut(auth);
                const modalProfil = document.getElementById("modalProfil");
                if (modalProfil) modalProfil.style.display = "none";
                modal.style.display = "none";
                window.location.href = "connexionCompte.html";
            } catch (error) {
                console.error("Erreur lors de la déconnexion:", error);
            }
        });
    }

    if (btnNon) {
        btnNon.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    return modal;
}

const btnDeconnexion = document.getElementById("btnDeconnexion");
if (btnDeconnexion) {
    btnDeconnexion.addEventListener("click", () => {
        let modal = document.getElementById("modalConfirmDeconnexion");
        if (!modal) {
            modal = creerModalDeconnexion();
        }
        modal.style.display = "flex";
    });
}

// Sécurité : vérifier si l'utilisateur est connecté et récupérer ses informations
onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    await chargerProfilUtilisateur();
});

// mot de passe oublié
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const bouttonMotDePasseOublie = document.getElementById("bouttonMotDePasseOublie");

if (bouttonMotDePasseOublie) {
    bouttonMotDePasseOublie.addEventListener("click", functionMotDePasseOublie);
}

async function functionMotDePasseOublie(event) {
    event.preventDefault();

    const emailOublie = document.getElementById("emailOublie").value;
    const erreurMotDePasseOublie = document.getElementById("erreurMotDePasseOublie");

    // Réinitialiser les messages
    erreurMotDePasseOublie.innerText = "";
    erreurMotDePasseOublie.classList.remove("oublie", "motDePasseCorrect");

    // Vérifier si l'email est vide
    if (emailOublie.trim() === "") {
        erreurMotDePasseOublie.classList.add("oublie");
        erreurMotDePasseOublie.innerText = "Vous devez entrer votre email";
        return;
    }

    try {
        // Envoi de l'email via Firebase
        await sendPasswordResetEmail(auth, emailOublie);

        erreurMotDePasseOublie.classList.add("motDePasseCorrect");
        erreurMotDePasseOublie.innerText =
            "Un email de réinitialisation a été envoyé dans vos spam est correcte.";
    } catch (error) {
        console.error("Erreur Firebase :", error.message);

        erreurMotDePasseOublie.classList.add("oublie");
        erreurMotDePasseOublie.innerText =
            "Impossible d'envoyer l'email. Vérifiez l'adresse.";
    }
}
