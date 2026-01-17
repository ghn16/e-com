// ===============================
// GESTION DES PRODUITS
// ===============================
const STORAGE_KEY = 'sneakers_produits';
const PANIER_KEY = 'sneakers_panier';
const AUTH_KEY = 'sneakers_admin_auth';

// Identifiants admin (à changer en production !)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Produits par défaut si localStorage vide
const produitsParDefaut = [
  { id: 1, nom: "AIR JORDAN 1 LOW", prix: 55000, prixAncien: 75000, promo: 30, image: "1.png", rating: 5, reviews: 234, stock: 8 },
  { id: 2, nom: "NIKE Air Jordan 1 Mid", prix: 80000, prixAncien: 110000, promo: 30, image: "2.png", rating: 5, reviews: 189, stock: 3 },
  { id: 3, nom: "NIKE V5 RNR SE", prix: 120000, prixAncien: 160000, promo: 30, image: "3.png", rating: 5, reviews: 156, stock: 12 },
  { id: 4, nom: "JORDAN SPIZIKE LOW", prix: 74000, prixAncien: 95000, promo: 30, image: "6.png", rating: 4, reviews: 142, stock: 5 },
  { id: 5, nom: "AIR JORDAN 10 RETRO", prix: 250000, prixAncien: 320000, promo: 30, image: "5.png", rating: 5, reviews: 298, stock: 2 },
  { id: 6, nom: "NIKE VOMERO BLACK", prix: 120000, prixAncien: 155000, promo: 30, image: "4.png", rating: 5, reviews: 176, stock: 15 },
  { id: 7, nom: "Air Jordan 4", prix: 110000, prixAncien: 145000, promo: 30, image: "7.png", rating: 5, reviews: 312, stock: 7 },
  { id: 8, nom: "NIKE METCON 10", prix: 45000, prixAncien: 65000, promo: 30, image: "8.png", rating: 4, reviews: 98, stock: 20 },
  { id: 9, nom: "NIKE AIR MAX MUSE", prix: 140000, prixAncien: 180000, promo: 30, image: "9.png", rating: 5, reviews: 201, stock: 6 },
  { id: 10, nom: "AIR MAX DN8", prix: 90000, prixAncien: 120000, promo: 30, image: "10.png", rating: 4, reviews: 167, stock: 10 }
];

// Charger les produits depuis localStorage ou utiliser par défaut
let produits = JSON.parse(localStorage.getItem(STORAGE_KEY)) || produitsParDefaut;
let panier = JSON.parse(localStorage.getItem(PANIER_KEY)) || [];

// Sauvegarder les produits
function sauvegarderProduits() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(produits));
}

// Initialiser si vide
if (!localStorage.getItem(STORAGE_KEY)) {
  sauvegarderProduits();
}

// ===============================
// PAGINATION & FILTRES
// ===============================
const PRODUITS_PAR_PAGE = 6;
let pageCourante = 1;
let produitsFiltres = [...produits];

// Éléments DOM
const grille = document.getElementById("grille-produits");
const filtreBudget = document.getElementById("filtre-budget");
const filtreTri = document.getElementById("filtre-tri");
const paginationNumbers = document.getElementById("pagination-numbers");
const btnPrevPage = document.getElementById("prev-page");
const btnNextPage = document.getElementById("next-page");

// Filtrer par budget
function filtrerParBudget() {
  const budget = filtreBudget.value;
  
  if (budget === "all") {
    produitsFiltres = [...produits];
  } else {
    const [min, max] = budget.split("-").map(Number);
    produitsFiltres = produits.filter(p => p.prix >= min && p.prix <= max);
  }
  
  trierProduits();
  pageCourante = 1;
  afficherProduits();
}

// Trier les produits
function trierProduits() {
  const tri = filtreTri.value;
  
  switch(tri) {
    case "prix-asc":
      produitsFiltres.sort((a, b) => a.prix - b.prix);
      break;
    case "prix-desc":
      produitsFiltres.sort((a, b) => b.prix - a.prix);
      break;
    case "nom":
      produitsFiltres.sort((a, b) => a.nom.localeCompare(b.nom));
      break;
    default:
      produitsFiltres = [...produits].filter(p => produitsFiltres.find(pf => pf.id === p.id));
  }
}

// Afficher les produits avec pagination
function afficherProduits() {
  grille.innerHTML = '';
  
  const debut = (pageCourante - 1) * PRODUITS_PAR_PAGE;
  const fin = debut + PRODUITS_PAR_PAGE;
  const produitsPage = produitsFiltres.slice(debut, fin);
  
  if (produitsPage.length === 0) {
    grille.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-gray); padding: 60px;">Aucun produit trouvé pour ce budget</p>';
    afficherPagination();
    return;
  }
  
  produitsPage.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("produit");
    
    const stars = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);
    
    // Badge stock
    let stockBadge = '';
    if (p.stock > 5) {
      stockBadge = '<div class="badge-stock">En stock</div>';
    } else if (p.stock > 0) {
      stockBadge = `<div class="badge-stock low">Plus que ${p.stock}</div>`;
    }
    
    // Livraison gratuite si > 50000
    const livraisonGratuite = p.prix >= 50000 ? '<div class="livraison-badge">Livraison offerte</div>' : '';
    
    div.innerHTML = `
      <div class="produit-header">
        ${p.promo ? `<div class="produit-promo">-${p.promo}%</div>` : ''}
        ${stockBadge}
        <div class="produit-like">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <img src="${p.image}" alt="${p.nom}" onerror="this.src='https://via.placeholder.com/300x300/1a1a1a/9AFF00?text=Image'">
        <div class="produit-glow"></div>
      </div>
      <div class="produit-body">
        <h3>${p.nom}</h3>
        <div class="produit-rating">
          <span class="stars">${stars}</span>
          <span class="reviews">${p.reviews}+ avis</span>
        </div>
        <div class="produit-prices">
          <p class="prix">${p.prix.toLocaleString()} FCFA</p>
          ${p.prixAncien ? `<p class="prix-ancien">${p.prixAncien.toLocaleString()} FCFA</p>` : ''}
        </div>
        ${livraisonGratuite}
        <button class="ajout-panier" data-id="${p.id}">Réserver maintenant</button>
        <div class="produit-infos">
          <div class="produit-info">Livraison 24-48h</div>
          <div class="produit-info">Taille 40-45</div>
        </div>
      </div>
    `;
    
    grille.appendChild(div);
  });
  
  attacherEventsProduits();
  afficherPagination();
  
  // Animation d'apparition des produits
  setTimeout(() => {
    document.querySelectorAll(".produit").forEach((produit, i) => {
      produit.style.opacity = "0";
      produit.style.transform = "translateY(30px)";
      setTimeout(() => {
        produit.style.transition = "all 0.6s ease";
        produit.style.opacity = "1";
        produit.style.transform = "translateY(0)";
      }, i * 100);
    });
  }, 10);
  
  // Animation badges stock faible
  setTimeout(() => {
    document.querySelectorAll('.badge-stock.low').forEach((badge, i) => {
      setTimeout(() => {
        badge.style.animation = 'urgencyPulse 2s ease-in-out infinite';
      }, i * 200);
    });
  }, 500);
}

// Afficher la pagination
function afficherPagination() {
  const totalPages = Math.ceil(produitsFiltres.length / PRODUITS_PAR_PAGE);
  
  paginationNumbers.innerHTML = '';
  
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('div');
    btn.classList.add('pagination-number');
    if (i === pageCourante) btn.classList.add('active');
    btn.textContent = i;
    btn.addEventListener('click', () => {
      pageCourante = i;
      afficherProduits();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    paginationNumbers.appendChild(btn);
  }
  
  btnPrevPage.disabled = pageCourante === 1;
  btnNextPage.disabled = pageCourante === totalPages || totalPages === 0;
}

// Navigation pagination
btnPrevPage.addEventListener('click', () => {
  if (pageCourante > 1) {
    pageCourante--;
    afficherProduits();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

btnNextPage.addEventListener('click', () => {
  const totalPages = Math.ceil(produitsFiltres.length / PRODUITS_PAR_PAGE);
  if (pageCourante < totalPages) {
    pageCourante++;
    afficherProduits();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// Event listeners filtres
filtreBudget.addEventListener('change', filtrerParBudget);
filtreTri.addEventListener('change', () => {
  trierProduits();
  pageCourante = 1;
  afficherProduits();
});

// ===============================
// GESTION DU PANIER
// ===============================
const btnPanier = document.getElementById("btn-panier");
const popup = document.getElementById("popup-panier");
const overlay = document.getElementById("popup-overlay");
const btnFermer = document.getElementById("fermer-panier");
const btnPayer = document.getElementById("payer");
const listePanier = document.getElementById("liste-panier");
const totalPanier = document.getElementById("total-panier");
const panierCount = document.getElementById("panier-count");
const livraisonGratuiteDiv = document.getElementById("livraison-gratuite");

function majPanier() {
  const badge = btnPanier.querySelector('.badge');
  badge.textContent = panier.length;
  panierCount.textContent = panier.length;
  localStorage.setItem(PANIER_KEY, JSON.stringify(panier));
  
  btnPanier.classList.remove("animate");
  void btnPanier.offsetWidth;
  btnPanier.classList.add("animate");
}

function ajouterAuPanier(id) {
  const produit = produits.find(p => p.id === id);
  if (produit) {
    panier.push(produit);
    majPanier();
  }
}

function afficherPanier() {
  listePanier.innerHTML = "";
  let total = 0;

  if (panier.length === 0) {
    listePanier.innerHTML = '<li style="text-align: center; color: var(--text-gray); padding: 20px;">Votre panier est vide</li>';
    totalPanier.textContent = `Total : 0 FCFA`;
    return;
  }

  panier.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${item.nom}</strong><br>
        <span style="color: var(--text-gray); font-size: 0.9rem;">${item.prix.toLocaleString()} FCFA</span>
      </div>
      <button data-index="${i}" class="supprimer">✕</button>
    `;
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

function ouvrirPanier() {
  popup.classList.add("active");
  overlay.classList.add("active");
  afficherPanier();
  document.body.style.overflow = 'hidden';
}

function fermerPanier() {
  popup.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = '';
}

btnPanier.addEventListener("click", ouvrirPanier);
btnFermer.addEventListener("click", fermerPanier);
overlay.addEventListener("click", fermerPanier);

// Paiement
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
    description: "Achat Sneakers",
    customer_email: "client@email.com",
    onComplete: function(resp) {
      if (resp.reason === "CHECKOUT COMPLETE") {
        alert("Paiement effectué avec succès ! ✅");
        panier = [];
        majPanier();
        fermerPanier();
      }
    }
  });
});

// Event listeners produits
function attacherEventsProduits() {
  document.querySelectorAll(".ajout-panier").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      ajouterAuPanier(parseInt(btn.dataset.id));
    });
  });
  
  document.querySelectorAll(".produit-like").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const svg = btn.querySelector('svg');
      if (svg.style.fill === 'red' || svg.style.fill === 'rgb(255, 0, 0)') {
        svg.style.fill = 'none';
      } else {
        svg.style.fill = 'red';
      }
    });
  });
}

// ===============================
// PANNEAU ADMIN
// ===============================
const formProduit = document.getElementById("form-produit");
const adminProduitsListe = document.getElementById("admin-produits-liste");
const countProduits = document.getElementById("count-produits");

// Ajouter un produit
formProduit.addEventListener("submit", (e) => {
  e.preventDefault();
  
  // Vérifier l'authentification
  if (!estConnecte()) {
    alert('Accès non autorisé');
    return;
  }
  
  const nouveauProduit = {
    id: Date.now(),
    nom: document.getElementById("input-nom").value,
    prix: parseInt(document.getElementById("input-prix").value),
    prixAncien: parseInt(document.getElementById("input-prix-ancien").value) || null,
    promo: parseInt(document.getElementById("input-promo").value) || null,
    image: document.getElementById("input-image").value,
    rating: parseInt(document.getElementById("input-rating").value),
    reviews: parseInt(document.getElementById("input-reviews").value) || 0,
    stock: parseInt(document.getElementById("input-stock").value) || 10
  };
  
  produits.push(nouveauProduit);
  sauvegarderProduits();
  
  // Reset formulaire
  formProduit.reset();
  
  // Rafraîchir
  produitsFiltres = [...produits];
  afficherProduits();
  afficherProduitsAdmin();
  
  alert("Produit ajouté avec succès !");
});

// Afficher les produits dans l'admin
function afficherProduitsAdmin() {
  if (!estConnecte()) {
    return; // Ne rien faire si pas connecté
  }
  
  adminProduitsListe.innerHTML = '';
  countProduits.textContent = produits.length;
  
  if (produits.length === 0) {
    adminProduitsListe.innerHTML = '<p style="text-align: center; color: var(--text-gray); padding: 40px;">Aucun produit en boutique</p>';
    return;
  }
  
  produits.forEach((p) => {
    const div = document.createElement('div');
    div.classList.add('admin-produit-item');
    div.innerHTML = `
      <div class="admin-produit-info">
        <h4>${p.nom}</h4>
        <p>${'★'.repeat(p.rating)}${'☆'.repeat(5 - p.rating)} • ${p.reviews} avis</p>
      </div>
      <div class="admin-produit-prix">${p.prix.toLocaleString()} FCFA</div>
      <button class="btn-admin-delete" data-id="${p.id}">Supprimer</button>
    `;
    adminProduitsListe.appendChild(div);
  });
  
  // Event listeners suppression
  document.querySelectorAll('.btn-admin-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        const id = parseInt(btn.dataset.id);
        produits = produits.filter(p => p.id !== id);
        sauvegarderProduits();
        produitsFiltres = [...produits];
        afficherProduits();
        afficherProduitsAdmin();
      }
    });
  });
}

// ===============================
// NAVIGATION ENTRE PAGES
// ===============================
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page-content');

// Vérifier si l'utilisateur est connecté
function estConnecte() {
  const auth = localStorage.getItem(AUTH_KEY);
  return auth === 'true';
}

// Gérer les liens de navigation normaux
document.querySelectorAll('[data-page="shop"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById('page-shop').classList.add('active');
  });
});

// Détecter si on accède directement à /admin
if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
  pages.forEach(p => p.classList.remove('active'));
  document.getElementById('page-admin').classList.add('active');
  
  if (estConnecte()) {
    afficherPanneauAdmin();
    afficherProduitsAdmin();
  }
}

// ===============================
// AUTHENTIFICATION ADMIN
// ===============================
const formLogin = document.getElementById('form-login');
const loginError = document.getElementById('login-error');
const adminLogin = document.getElementById('admin-login');
const adminPanel = document.getElementById('admin-panel');
const btnLogout = document.getElementById('btn-logout');
const adminText = document.getElementById('admin-text');
const logoutText = document.getElementById('logout-text');

// Connexion
formLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    // Connexion réussie
    localStorage.setItem(AUTH_KEY, 'true');
    afficherPanneauAdmin();
    afficherProduitsAdmin();
    
    // Vider le formulaire
    formLogin.reset();
    loginError.classList.remove('show');
  } else {
    // Erreur de connexion
    loginError.textContent = 'Identifiants incorrects';
    loginError.classList.add('show');
    
    // Effacer l'erreur après 3 secondes
    setTimeout(() => {
      loginError.classList.remove('show');
    }, 3000);
  }
});

// Afficher le panneau admin
function afficherPanneauAdmin() {
  adminLogin.style.display = 'none';
  adminPanel.style.display = 'block';
}

// Déconnexion
function deconnexion() {
  localStorage.removeItem(AUTH_KEY);
  adminLogin.style.display = 'flex';
  adminPanel.style.display = 'none';
  
  // Retour à la boutique
  window.location.href = '/';
}

btnLogout.addEventListener('click', deconnexion);

// Vérifier l'état de connexion au chargement
function verifierConnexion() {
  // Pas de modification du menu, admin accessible uniquement par URL
}

// ===============================
// INITIALISATION
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // Initialiser les produits filtrés
  produitsFiltres = [...produits];
  
  // Afficher les produits
  afficherProduits();
  
  // Mettre à jour le panier
  majPanier();
  
  // Vérifier la connexion
  verifierConnexion();
  
  // === HERO ANIMATIONS ===
  initHeroAnimations();
});

// ===== HERO ANIMATIONS INTERACTIVES =====
function initHeroAnimations() {
  const heroCTA = document.getElementById('hero-cta');
  const heroGlow = document.getElementById('hero-glow');
  const heroCircle = document.getElementById('hero-circle');
  const trustBadge = document.querySelector('.hero-trust-badge');

  // Interaction CTA -> Animation cercle + glow
  heroCTA.addEventListener('mouseenter', () => {
    heroGlow.classList.add('active');
    heroCircle.classList.add('zoom');
  });

  heroCTA.addEventListener('mouseleave', () => {
    heroGlow.classList.remove('active');
    heroCircle.classList.remove('zoom');
  });

  // Animation au clic CTA
  heroCTA.addEventListener('click', () => {
    // Flash effect
    heroGlow.style.animation = 'none';
    heroGlow.style.opacity = '1';
    setTimeout(() => {
      heroGlow.style.animation = 'pulse 3s ease-in-out infinite';
      heroGlow.style.opacity = '0.5';
    }, 300);
  });

  // Pulse badge trust toutes les 5s
  setInterval(() => {
    trustBadge.style.transform = 'scale(1.08)';
    setTimeout(() => {
      trustBadge.style.transform = 'scale(1)';
    }, 300);
  }, 5000);

  trustBadge.style.transition = 'transform 0.3s ease';
}

// Échap pour fermer le panier
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && popup.classList.contains("active")) {
    fermerPanier();
  }
});