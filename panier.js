// panier.js - Version avec numéros de paiement directs

let panier = JSON.parse(localStorage.getItem("panier")) || [];

function montrerNotification(message) {
  const notif = document.getElementById("notification");
  if (!notif) return;
  notif.textContent = message;
  notif.classList.add("show");
  setTimeout(() => notif.classList.remove("show"), 3000);
}

function ajouterAuPanier(nom, prix) {
  const existant = panier.find(item => item.nom === nom);
  if (existant) {
    existant.quantite++;
  } else {
    panier.push({ nom, prix, quantite: 1 });
  }
  localStorage.setItem("panier", JSON.stringify(panier));
  montrerNotification(`${nom} ajouté ✅`);
  if (document.getElementById("panier-container")) afficherPanier();
}

function modifierQuantite(index, delta) {
  panier[index].quantite += delta;
  if (panier[index].quantite < 1) panier.splice(index, 1);
  localStorage.setItem("panier", JSON.stringify(panier));
  afficherPanier();
}

function supprimerPlat(index) {
  panier.splice(index, 1);
  localStorage.setItem("panier", JSON.stringify(panier));
  afficherPanier();
}

function calculerTotal() {
  return panier.reduce((sum, item) => sum + item.prix * item.quantite, 0);
}

function afficherPanier() {
  const container = document.getElementById("panier-container");
  const totalSpan = document.getElementById("total-panier");
  if (!container || !totalSpan) return;

  container.innerHTML = "";

  if (panier.length === 0) {
    container.innerHTML = `<p style="text-align:center; padding:80px; color:#777;">Votre panier est vide</p>`;
    totalSpan.textContent = "0";
    return;
  }

  panier.forEach((item, index) => {
    const subtotal = item.prix * item.quantite;
    const div = document.createElement("div");
    div.className = "plat-panier";
    div.innerHTML = `
      <div>
        <strong>${item.nom}</strong><br>
        <small>${item.prix} FCFA × ${item.quantite}</small>
      </div>
      <div style="text-align:right;">
        <div style="font-weight:bold; font-size:1.3rem;">${subtotal} FCFA</div>
        <div style="margin-top:10px;">
          <button onclick="modifierQuantite(${index}, -1)" style="width:35px;height:35px;border-radius:50%;border:1px solid #ccc;">–</button>
          <span style="margin:0 12px; font-weight:600;">${item.quantite}</span>
          <button onclick="modifierQuantite(${index}, 1)" style="width:35px;height:35px;border-radius:50%;border:1px solid #ccc;">+</button>
          <button onclick="supprimerPlat(${index})" style="margin-left:20px; color:#e74c3c; background:none; border:none;">Supprimer</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });

  totalSpan.textContent = calculerTotal();
}

// ==================== PAIEMENTS AVEC NUMÉROS DIRECTS ====================

function afficherOptionsPaiement() {
  const container = document.getElementById("payment-options");
  if (!container) return;

  const options = [
    { 
      nom: "Orange Money", 
      icon: "📱", 
      color: "#ff7900", 
      numero: "97789308"     // ← Change avec le vrai numéro
    },
    { 
      nom: "Moov Money",   
      icon: "📱", 
      color: "#00a650", 
      numero: "97789308"     // ← Change avec le vrai numéro
    },
    { 
      nom: "Wave",         
      icon: "🌊", 
      color: "#00bfff", 
      numero: "97789308"     // ← Change avec le vrai numéro (si Wave)
    }
  ];

  container.innerHTML = "";

  options.forEach(opt => {
    const div = document.createElement("div");
    div.style.cssText = `border: 2px solid ${opt.color}30; border-radius: 16px; padding: 20px; text-align:center; cursor:pointer; transition:0.3s;`;
    
    div.innerHTML = `
      <div style="font-size:2.5rem; margin-bottom:10px;">${opt.icon}</div>
      <strong>${opt.nom}</strong>
      <p style="margin:8px 0 4px; color:#27ae60; font-weight:600;">${opt.numero}</p>
      <small style="color:#777;">Cliquez pour envoyer la demande</small>
    `;

    div.onclick = () => lancerPaiement(opt.nom, opt.numero);
    container.appendChild(div);
  });
}

function lancerPaiement(methode, numeroPaiement) {
  const total = calculerTotal();
  if (total === 0) {
    montrerNotification("Votre panier est vide !");
    return;
  }

  let message = `Bonjour,\n\n`;
  message += `Je viens de faire une commande.\n`;
  message += `Montant total : *${total} FCFA*\n`;
  message += `Moyen de paiement : *${methode}*\n\n`;
  message += `Voici ma commande :\n\n`;

  panier.forEach(item => {
    message += `- ${item.nom} × ${item.quantite} = ${item.prix * item.quantite} FCFA\n`;
  });

  message += `\nVeuillez confirmer la réception du paiement sur :\n`;
  message += `*${methode} : ${numeroPaiement}*`;

  // Ouvre WhatsApp avec le message
  window.open(`https://wa.me/22897789308?text=${encodeURIComponent(message)}`, '_blank');
  
  montrerNotification(`Demande envoyée via ${methode}`);
}

// Commande classique via WhatsApp (sans choix de paiement)
function envoyerCommandeWhatsApp() {
  const total = calculerTotal();
  if (total === 0) {
    montrerNotification("Votre panier est vide !");
    return;
  }

  let message = "Bonjour,\nJe souhaite commander :\n\n";
  panier.forEach(item => {
    message += `- ${item.nom} × ${item.quantite} = ${item.prix * item.quantite} FCFA\n`;
  });
  message += `\nTotal : ${total} FCFA\n\nMerci de me confirmer !`;

  window.open(`https://wa.me/22897789308?text=${encodeURIComponent(message)}`, '_blank');
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  afficherPanier();
  afficherOptionsPaiement();
});