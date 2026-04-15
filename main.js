// main.js complet - Avec animations fluides (style vidéo)

let categorieActuelle = "tous";

// Fonction pour animer l'apparition des cartes (comme dans la vidéo)
function animerCartes() {
  const cartes = document.querySelectorAll('.plat');
  cartes.forEach((carte, index) => {
    carte.style.opacity = '0';
    carte.style.transform = 'translateY(40px)';
    
    setTimeout(() => {
      carte.style.transition = 'all 0.8s ease';
      carte.style.opacity = '1';
      carte.style.transform = 'translateY(0)';
    }, 100 + index * 150); // Décalage progressif
  });
}

// Afficher tous les plats avec animation
function afficherPlats(filtre = "tous") {
  const container = document.getElementById("plats-container");
  if (!container) return;

  container.innerHTML = "";

  const platsFiltres = filtre === "tous" 
    ? plats 
    : plats.filter(plat => plat.categorie === filtre);

  platsFiltres.forEach(plat => {
    const div = document.createElement("div");
    div.classList.add("plat");

    div.innerHTML = `
      <img src="${plat.image}" alt="${plat.nom}" onerror="this.src='https://picsum.photos/id/292/600/400'; this.onerror=null;">
      <div class="plat-content">
        <h3>${plat.nom}</h3>
        <p class="desc">${plat.desc}</p>
        <p class="price">${plat.prix} FCFA</p>
        <button onclick="ajouterAuPanier('${plat.nom.replace(/'/g, "\\'")}', ${plat.prix})">
          Ajouter au panier
        </button>
      </div>
    `;
    container.appendChild(div);
  });

  // Animation après l'ajout des cartes
  setTimeout(animerCartes, 300);
}

// Menu du jour sur l'accueil
function afficherMenuDuJour() {
  const container = document.getElementById("menu-jour-container");
  if (!container) return;

  container.innerHTML = "";

  plats.slice(0, 4).forEach(plat => {
    const div = document.createElement("div");
    div.classList.add("plat");

    div.innerHTML = `
      <img src="${plat.image}" alt="${plat.nom}" onerror="this.src='https://picsum.photos/id/292/600/400'; this.onerror=null;">
      <div class="plat-content">
        <h3>${plat.nom}</h3>
        <p class="price">${plat.prix} FCFA</p>
        <button onclick="ajouterAuPanier('${plat.nom.replace(/'/g, "\\'")}', ${plat.prix})">Ajouter</button>
      </div>
    `;
    container.appendChild(div);
  });

  setTimeout(animerCartes, 400);
}

// Création des boutons de catégories avec animation
function creerBoutonsCategories() {
  const categories = [
    { id: "tous", nom: "Tout" },
    { id: "plats", nom: "Plats Principaux" },
    { id: "accompagnements", nom: "Accompagnements" },
    { id: "boissons", nom: "Boissons" }
  ];

  const container = document.getElementById("categories");
  if (!container) return;

  container.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat.nom;
    btn.classList.add("categorie-btn");
    if (cat.id === "tous") btn.classList.add("active");

    btn.onclick = () => {
      document.querySelectorAll('.categorie-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      afficherPlats(cat.id);
    };

    container.appendChild(btn);
  });
}

// Animation typewriter pour le hero (comme dans la vidéo)
function typewriterEffect() {
  const texts = document.querySelectorAll('.typewriter, .typewriter2');
  texts.forEach((text, index) => {
    text.style.opacity = '1';
  });
}

// Initialisation complète
document.addEventListener("DOMContentLoaded", () => {
  // Créer les catégories et afficher les plats
  creerBoutonsCategories();
  afficherPlats("tous");
  afficherMenuDuJour();

  // Lancer l'effet typewriter sur le hero
  setTimeout(typewriterEffect, 800);

  // Animation au scroll pour les sections
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
      }
    });
  });

  console.log('%c✅ Resto Shalom - Animations activées avec succès !', 'color:#e67e22; font-size:16px; font-weight:bold');
});