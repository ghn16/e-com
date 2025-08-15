const produits = [
  { nom: "AIR JORDAN 1 LOW", prix: 55000, image: "1.png" },
  { nom: "NIKE Air Jordan 1 Mid ", prix: 80000, image: "2.png" },
  { nom: "NIKE V5 RNR SE", prix: 120000, image: "3.png" },
  { nom: "JORDAN SPIZIKE LOW", prix: 74000, image: "6.png" },
  { nom: "AIR JORDAN 10 RETRO", prix: 250000, image: "5.PNG" },
  { nom: "NIKE VOMERO  BLACK", prix: 120000, image: "4.png" },
  { nom: "Air Jordan 4", prix: 110000, image: "7.png" },
  { nom: "NIKE METCON 10", prix: 45000, image: "8.png" },
  { nom: "NIKE AIR MAX MUSE", prix: 140000, image: "9.png" },
  { nom: "AIR MAX DN8", prix: 90000, image: "10.png" }
];

let panier = JSON.parse(localStorage.getItem("panier")) || [];

const grille = document.getElementById("grille-produits");
produits.forEach((p, i) => {
  const div = document.createElement("div");
  div.classList.add("produit");
  div.innerHTML = `
    <img src="${p.image}" alt="${p.nom}">
    <h3>${p.nom}</h3>
    <p class="prix">${p.prix.toLocaleString()} FCFA</p>
    <button class="ajout-panier" data-index="${i}">Ajouter au panier</button>
  `;
  grille.appendChild(div);
});


const btnPanier = document.getElementById("btn-panier");
const popup = document.getElementById("popup-panier");
const btnFermer = document.getElementById("fermer-panier");
const btnPayer = document.getElementById("payer");
const listePanier = document.getElementById("liste-panier");
const totalPanier = document.getElementById("total-panier");


function majPanier() {
  btnPanier.textContent = `🛒 Panier (${panier.length})`;
  localStorage.setItem("panier", JSON.stringify(panier));

 
  btnPanier.classList.remove("animate");
  void btnPanier.offsetWidth;
  btnPanier.classList.add("animate");
}


document.querySelectorAll(".ajout-panier").forEach(btn => {
  btn.addEventListener("click", () => {
    panier.push(produits[btn.dataset.index]);
    majPanier();
  });
});


function afficherPanier() {
  listePanier.innerHTML = "";
  let total = 0;

  panier.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.nom} - ${item.prix.toLocaleString()} FCFA <button data-index="${i}" class="supprimer">❌</button>`;
    listePanier.appendChild(li);
    total += item.prix;
  });

  totalPanier.textContent = `Total : ${total.toLocaleString()} FCFA`;

  document.querySelectorAll(".supprimer").forEach(btn => {
    btn.addEventListener("click", () => {
      panier.splice(btn.dataset.index, 1);
      majPanier();
      afficherPanier();
    });
  });
}


btnPanier.addEventListener("click", () => {
  popup.classList.add("active");
  afficherPanier();
});

btnFermer.addEventListener("click", () => {
  popup.classList.remove("active");
});

btnPayer.addEventListener("click", () => {
  if (panier.length === 0) {
    alert("Votre panier est vide !");
    return;
  }

  const total = panier.reduce((sum, p) => sum + p.prix, 0);

  
  FedaPay.init("#payer", {
    public_key: "pk_live_u5hGdOWIcGK5zuBeSPJljRZr",
    amount: total,
    currency: "XOF",
    order_id: Date.now().toString(),
    description: "Achat Boutique",
    customer_email: "client@email.com"
  });
});

majPanier();
