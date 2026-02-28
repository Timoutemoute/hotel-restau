// Configuration
const WEBHOOK_URL = 'VOTRE_URL_WEBHOOK_DISCORD';
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'Bellevue2024!';

// Données statiques
const ROOMS = [
    {
        id: 'classique',
        name: 'Chambre Classique',
        price: 95,
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
        description: 'Élégance et confort pour un séjour paisible',
        size: 18,
        bed: 'Lit double (140cm) ou deux lits simples',
        features: ['Salle de bain privative', 'TV écran plat', 'WiFi haut débit', 'Climatisation', 'Coffee maker']
    },
    {
        id: 'superieure',
        name: 'Chambre Supérieure',
        price: 145,
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
        description: 'Espace généreux avec vue sur le jardin',
        size: 25,
        bed: 'Lit queen size (160cm)',
        features: ['Douche à l\'italienne', 'TV 4K', 'WiFi premium', 'Climatisation', 'Nespresso', 'Balcon']
    },
    {
        id: 'deluxe',
        name: 'Chambre Deluxe',
        price: 195,
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39',
        description: 'Prestations haut de gamme pour une expérience unique',
        size: 32,
        bed: 'Lit king size (180cm)',
        features: ['Baignoire balnéo', 'TV 4K 55"', 'WiFi premium', 'Climatisation', 'Nespresso', 'Terrasse privée', 'Mini-bar offert']
    },
    {
        id: 'suite',
        name: 'Suite Familiale',
        price: 280,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
        description: 'Espace de vie séparé, idéal pour les familles',
        size: 45,
        bed: '1 lit king + 2 lits simples',
        features: ['Deux salles de bain', '2 TV', 'WiFi premium', 'Climatisation', 'Kitchenette', 'Salon séparé', 'Balcon']
    }
];

const MENU = {
    entrees: [
        { name: 'Escargots de Bourgogne', description: 'Douzaine d\'escargots au beurre persillé maison', price: 14 },
        { name: 'Foie gras de canard', description: 'Maison, chutney de figues et pain brioché', price: 16 },
        { name: 'Soupe à l\'oignon gratinée', description: 'Recette traditionnelle, gratinée au gruyère', price: 12 },
        { name: 'Saumon fumé', description: 'Fumé maison, blinis et crème citronnée', price: 15 }
    ],
    plats: [
        { name: 'Filet de bœuf', description: 'Sauce au poivre, gratin dauphinois', price: 28 },
        { name: 'Dos de cabillaud', description: 'Beurre blanc, légumes de saison', price: 26 },
        { name: 'Coq au Riesling', description: 'Spécialité alsacienne, spätzle fraîches', price: 24 },
        { name: 'Magret de canard', description: 'Miel et épices, pommes sautées', price: 27 }
    ],
    desserts: [
        { name: 'Crème brûlée', description: 'À la vanille de Madagascar', price: 10 },
        { name: 'Tarte Tatin', description: 'Façon grand-mère, glace vanille', price: 11 },
        { name: 'Profiteroles', description: 'Choux, glace vanille, chocolat chaud', price: 12 },
        { name: 'Soufflé au Grand Marnier', description: 'Préparation minute', price: 13 }
    ]
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadPage('accueil');
    initMobileMenu();
});

// Mobile menu
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }
}

// Chargement des pages
async function loadPage(pageName) {
    const mainContent = document.getElementById('main-content');
    
    try {
        const response = await fetch(`pages/${pageName}.html`);
        const html = await response.text();
        mainContent.innerHTML = html;
        
        // Initialisation selon la page
        switch(pageName) {
            case 'chambres':
                initRoomsPage();
                break;
            case 'restaurant':
                initRestaurantPage();
                break;
            case 'reservation':
                initReservationPage();
                break;
            case 'contact':
                initContactPage();
                break;
            case 'personnel':
                initPersonnelPage();
                break;
        }
        
        // Mise à jour du menu actif
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick')?.includes(pageName)) {
                link.classList.add('active');
            }
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('Erreur de chargement:', error);
        mainContent.innerHTML = `
            <div class="container">
                <h1>Erreur</h1>
                <p>Impossible de charger la page demandée.</p>
            </div>
        `;
    }
}

// Page chambres
function initRoomsPage() {
    const container = document.getElementById('rooms-container');
    if (!container) return;
    
    container.innerHTML = ROOMS.map(room => `
        <div class="room-card">
            <div class="room-image">
                <img src="${room.image}" alt="${room.name}">
                <div class="room-price">${room.price}€ <span>/nuit</span></div>
            </div>
            <div class="room-content">
                <h3>${room.name}</h3>
                <p class="room-description">${room.description}</p>
                <div class="room-details">
                    <span><i class="fas fa-arrows-alt"></i> ${room.size}m²</span>
                    <span><i class="fas fa-bed"></i> ${room.bed}</span>
                </div>
                <ul class="room-features">
                    ${room.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
                </ul>
                <button class="btn btn-primary" onclick="goToReservation('hotel', '${room.id}')">
                    Réserver cette chambre
                </button>
            </div>
        </div>
    `).join('');
}

// Page restaurant
function initRestaurantPage() {
    // Menu
    const menuContainer = document.getElementById('menu-container');
    if (menuContainer) {
        menuContainer.innerHTML = `
            <div class="menu-section">
                <h2>Entrées</h2>
                <div class="menu-items">
                    ${MENU.entrees.map(item => `
                        <div class="menu-item">
                            <div class="menu-item-content">
                                <h4>${item.name}</h4>
                                <p>${item.description}</p>
                            </div>
                            <div class="menu-item-price">${item.price}€</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="menu-section">
                <h2>Plats</h2>
                <div class="menu-items">
                    ${MENU.plats.map(item => `
                        <div class="menu-item">
                            <div class="menu-item-content">
                                <h4>${item.name}</h4>
                                <p>${item.description}</p>
                            </div>
                            <div class="menu-item-price">${item.price}€</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="menu-section">
                <h2>Desserts</h2>
                <div class="menu-items">
                    ${MENU.desserts.map(item => `
                        <div class="menu-item">
                            <div class="menu-item-content">
                                <h4>${item.name}</h4>
                                <p>${item.description}</p>
                            </div>
                            <div class="menu-item-price">${item.price}€</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Menus
    const menusContainer = document.getElementById('menus-container');
    if (menusContainer) {
        menusContainer.innerHTML = `
            <div class="menu-card">
                <h4>Menu Découverte</h4>
                <p>Entrée + Plat + Dessert</p>
                <div class="price">32€</div>
                <button class="btn btn-outline btn-sm" onclick="goToReservation('restaurant', 'decouverte')">Choisir</button>
            </div>
            <div class="menu-card">
                <h4>Menu Gastronomique</h4>
                <p>Entrée + Plat + Dessert + Café</p>
                <div class="price">45€</div>
                <button class="btn btn-outline btn-sm" onclick="goToReservation('restaurant', 'gastronomique')">Choisir</button>
            </div>
            <div class="menu-card">
                <h4>Menu Enfant</h4>
                <p>Plat + Dessert + Boisson</p>
                <div class="price">15€</div>
                <button class="btn btn-outline btn-sm" onclick="goToReservation('restaurant', 'enfant')">Choisir</button>
            </div>
        `;
    }
}

// Page réservation
function initReservationPage() {
    const typeSelect = document.getElementById('reservation-type');
    const hotelForm = document.getElementById('hotel-form');
    const restaurantForm = document.getElementById('restaurant-form');
    
    if (typeSelect) {
        typeSelect.addEventListener('change', () => {
            const value = typeSelect.value;
            hotelForm.style.display = value === 'hotel' ? 'block' : 'none';
            restaurantForm.style.display = value === 'restaurant' ? 'block' : 'none';
        });
    }
    
    // Calcul automatique des nuits
    const arrivee = document.getElementById('arrivee');
    const depart = document.getElementById('depart');
    const nuits = document.getElementById('nuits');
    
    if (arrivee && depart && nuits) {
        const calculateNights = () => {
            if (arrivee.value && depart.value) {
                const start = new Date(arrivee.value);
                const end = new Date(depart.value);
                const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                nuits.value = diff > 0 ? diff : 1;
                updateHotelTotal();
            }
        };
        
        arrivee.addEventListener('change', calculateNights);
        depart.addEventListener('change', calculateNights);
    }
    
    // Compteurs
    initCounters();
}

function initCounters() {
    document.querySelectorAll('.counter').forEach(counter => {
        const minus = counter.querySelector('.counter-minus');
        const plus = counter.querySelector('.counter-plus');
        const input = counter.querySelector('input');
        
        if (minus && plus && input) {
            minus.addEventListener('click', () => {
                let val = parseInt(input.value) || 0;
                if (val > 0) {
                    input.value = val - 1;
                    updateTotal();
                }
            });
            
            plus.addEventListener('click', () => {
                let val = parseInt(input.value) || 0;
                input.value = val + 1;
                updateTotal();
            });
        }
    });
}

function updateHotelTotal() {
    const chambre = document.getElementById('chambre');
    const nuits = document.getElementById('nuits');
    const total = document.getElementById('hotel-total');
    
    if (chambre && nuits && total) {
        const chambrePrice = ROOMS.find(r => r.id === chambre.value)?.price || 95;
        const nights = parseInt(nuits.value) || 1;
        total.textContent = `${chambrePrice * nights}€`;
    }
}

function updateRestaurantTotal() {
    const adultes = document.getElementById('adultes')?.value || 0;
    const enfants = document.getElementById('enfants')?.value || 0;
    const menu = document.querySelector('input[name="menu"]:checked')?.value || 'decouverte';
    
    const prices = { decouverte: 32, gastronomique: 45, enfant: 15 };
    const price = prices[menu] || 32;
    
    const total = (parseInt(adultes) * price) + (parseInt(enfants) * price * 0.5);
    document.getElementById('restaurant-total').textContent = `${total}€`;
}

// Envoi de réservation
async function submitReservation() {
    const type = document.getElementById('reservation-type').value;
    
    const formData = {
        type: type === 'hotel' ? 'Hôtel' : 'Restaurant',
        nom: document.getElementById('nom').value,
        email: document.getElementById('email').value,
        telephone: document.getElementById('telephone').value,
        date: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
    };
    
    if (type === 'hotel') {
        formData.chambre = document.getElementById('chambre').options[document.getElementById('chambre').selectedIndex].text;
        formData.arrivee = document.getElementById('arrivee').value;
        formData.depart = document.getElementById('depart').value;
        formData.nuits = document.getElementById('nuits').value;
        formData.adultes = document.getElementById('adultes-hotel').value;
        formData.enfants = document.getElementById('enfants-hotel').value;
        formData.total = document.getElementById('hotel-total').textContent;
    } else {
        formData.date = document.getElementById('date-restaurant').value;
        formData.heure = document.getElementById('heure').value;
        formData.adultes = document.getElementById('adultes').value;
        formData.enfants = document.getElementById('enfants').value;
        formData.menu = document.querySelector('input[name="menu"]:checked')?.parentElement.querySelector('h4').textContent;
        formData.total = document.getElementById('restaurant-total').textContent;
    }
    
    formData.message = document.getElementById('demande')?.value || '';
    
    try {
        await sendToDiscord(formData, 'reservation');
        
        const message = document.getElementById('reservation-message');
        message.className = 'alert alert-success';
        message.textContent = 'Votre réservation a bien été enregistrée. Nous vous enverrons une confirmation par email.';
        message.style.display = 'block';
        
        document.getElementById('reservation-form').reset();
        
    } catch (error) {
        console.error('Erreur:', error);
        const message = document.getElementById('reservation-message');
        message.className = 'alert alert-error';
        message.textContent = 'Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.';
        message.style.display = 'block';
    }
}

// Envoi vers Discord
async function sendToDiscord(data, type) {
    if (WEBHOOK_URL === 'VOTRE_URL_WEBHOOK_DISCORD') {
        console.log('Webhook non configuré');
        return;
    }
    
    const embed = {
        title: type === 'reservation' ? '📅 Nouvelle réservation' : '📧 Nouveau message',
        color: type === 'reservation' ? 0x2ECC71 : 0x3498DB,
        fields: Object.entries(data).map(([key, value]) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: value.toString(),
            inline: true
        })),
        timestamp: new Date().toISOString()
    };
    
    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });
    } catch (error) {
        console.error('Erreur Discord:', error);
    }
}

// Navigation vers réservation
function goToReservation(type, option) {
    loadPage('reservation');
    // Ici on pourrait pré-remplir le formulaire selon l'option
}

// Page contact
function initContactPage() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                nom: document.getElementById('nom').value,
                email: document.getElementById('email').value,
                telephone: document.getElementById('telephone').value,
                sujet: document.getElementById('sujet').value,
                message: document.getElementById('message').value,
                date: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
            };
            
            const message = document.getElementById('contact-message');
            
            try {
                await sendToDiscord(formData, 'contact');
                
                message.className = 'alert alert-success';
                message.textContent = 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.';
                message.style.display = 'block';
                
                form.reset();
                
            } catch (error) {
                message.className = 'alert alert-error';
                message.textContent = 'Erreur lors de l\'envoi. Veuillez réessayer.';
                message.style.display = 'block';
            }
        });
    }
}

// Page personnel
function initPersonnelPage() {
    if (localStorage.getItem('loggedIn') === 'true') {
        showPersonnelSpace();
    }
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            login();
        });
    }
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('login-message');
    
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        localStorage.setItem('loggedIn', 'true');
        showPersonnelSpace();
    } else {
        message.textContent = 'Identifiants incorrects';
        message.style.color = '#dc3545';
    }
}

function showPersonnelSpace() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('personnel-section').style.display = 'block';
}

function logout() {
    localStorage.removeItem('loggedIn');
    location.reload();
}