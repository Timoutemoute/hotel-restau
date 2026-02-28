// Configuration
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1477392037820239892/5W86pVi9jdBW0V0-oAR8PfQDwFbgrakp8dTL0muiLaNmIzIDogLYcgZ72ppbtGxv-z-l';
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'Bellevue2024!';

// Données statiques
const ROOMS = [
    {
        id: 'classique',
        name: 'Chambre Classique',
        price: 95,
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Élégance et confort pour un séjour paisible',
        size: 18,
        bed: 'Lit double (140cm) ou deux lits simples',
        features: ['Salle de bain privative', 'TV écran plat', 'WiFi haut débit', 'Climatisation', 'Coffee maker']
    },
    {
        id: 'superieure',
        name: 'Chambre Supérieure',
        price: 145,
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Espace généreux avec vue sur le jardin',
        size: 25,
        bed: 'Lit queen size (160cm)',
        features: ['Douche à l\'italienne', 'TV 4K', 'WiFi premium', 'Climatisation', 'Nespresso', 'Balcon']
    },
    {
        id: 'deluxe',
        name: 'Chambre Deluxe',
        price: 195,
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Prestations haut de gamme pour une expérience unique',
        size: 32,
        bed: 'Lit king size (180cm)',
        features: ['Baignoire balnéo', 'TV 4K 55"', 'WiFi premium', 'Climatisation', 'Nespresso', 'Terrasse privée', 'Mini-bar offert']
    },
    {
        id: 'suite',
        name: 'Suite Familiale',
        price: 280,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Espace de vie séparé, idéal pour les familles',
        size: 45,
        bed: '1 lit king + 2 lits simples',
        features: ['Deux salles de bain', '2 TV', 'WiFi premium', 'Climatisation', 'Kitchenette', 'Salon séparé', 'Balcon']
    }
];

const MENU_PRICES = {
    decouverte: 32,
    gastronomique: 45,
    enfant: 15
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
        setTimeout(() => {
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
        }, 100); // Petit délai pour que le DOM soit prêt
        
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
                    <div class="menu-item">
                        <div class="menu-item-content">
                            <h4>Escargots de Bourgogne</h4>
                            <p>Douzaine d'escargots au beurre persillé maison</p>
                        </div>
                        <div class="menu-item-price">14€</div>
                    </div>
                    <div class="menu-item">
                        <div class="menu-item-content">
                            <h4>Foie gras de canard</h4>
                            <p>Maison, chutney de figues et pain brioché</p>
                        </div>
                        <div class="menu-item-price">16€</div>
                    </div>
                    <div class="menu-item">
                        <div class="menu-item-content">
                            <h4>Soupe à l'oignon gratinée</h4>
                            <p>Recette traditionnelle, gratinée au gruyère</p>
                        </div>
                        <div class="menu-item-price">12€</div>
                    </div>
                </div>
            </div>
            <div class="menu-section">
                <h2>Plats</h2>
                <div class="menu-items">
                    <div class="menu-item">
                        <div class="menu-item-content">
                            <h4>Filet de bœuf</h4>
                            <p>Sauce au poivre, gratin dauphinois</p>
                        </div>
                        <div class="menu-item-price">28€</div>
                    </div>
                    <div class="menu-item">
                        <div class="menu-item-content">
                            <h4>Dos de cabillaud</h4>
                            <p>Beurre blanc, légumes de saison</p>
                        </div>
                        <div class="menu-item-price">26€</div>
                    </div>
                    <div class="menu-item">
                        <div class="menu-item-content">
                            <h4>Coq au Riesling</h4>
                            <p>Spécialité alsacienne, spätzle fraîches</p>
                        </div>
                        <div class="menu-item-price">24€</div>
                    </div>
                </div>
            </div>
            <div class="menu-section">
                <h2>Desserts</h2>
                <div class="menu-items">
                    <div class="menu-item">
                        <div class="menu-item-content">
                            <h4>Crème brûlée</h4>
                            <p>À la vanille de Madagascar</p>
                        </div>
                        <div class="menu-item-price">10€</div>
                    </div>
                    <div class="menu-item">
                        <div class="menu-item-content">
                            <h4>Tarte Tatin</h4>
                            <p>Façon grand-mère, glace vanille</p>
                        </div>
                        <div class="menu-item-price">11€</div>
                    </div>
                    <div class="menu-item">
                        <div class="menu-item-content">
                            <h4>Profiteroles</h4>
                            <p>Choux, glace vanille, chocolat chaud</p>
                        </div>
                        <div class="menu-item-price">12€</div>
                    </div>
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
        typeSelect.addEventListener('change', function() {
            const value = this.value;
            if (hotelForm) hotelForm.style.display = value === 'hotel' ? 'block' : 'none';
            if (restaurantForm) restaurantForm.style.display = value === 'restaurant' ? 'block' : 'none';
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
    
    // Chambre change
    const chambre = document.getElementById('chambre');
    if (chambre) {
        chambre.addEventListener('change', updateHotelTotal);
    }
    
    // Initialiser les compteurs
    initCounters();
    
    // Initialiser les radios menu
    initMenuRadios();
}

function initCounters() {
    document.querySelectorAll('.counter').forEach(counter => {
        const minus = counter.querySelector('.counter-minus');
        const plus = counter.querySelector('.counter-plus');
        const input = counter.querySelector('input');
        
        if (minus && plus && input) {
            // Supprimer les anciens listeners pour éviter les doublons
            const newMinus = minus.cloneNode(true);
            const newPlus = plus.cloneNode(true);
            minus.parentNode.replaceChild(newMinus, minus);
            plus.parentNode.replaceChild(newPlus, plus);
            
            newMinus.addEventListener('click', function() {
                let val = parseInt(input.value) || 0;
                if (val > 0) {
                    input.value = val - 1;
                    updateTotal();
                }
            });
            
            newPlus.addEventListener('click', function() {
                let val = parseInt(input.value) || 0;
                input.value = val + 1;
                updateTotal();
            });
        }
    });
}

function initMenuRadios() {
    const radios = document.querySelectorAll('input[name="menu"]');
    radios.forEach(radio => {
        radio.addEventListener('change', updateRestaurantTotal);
    });
}

function updateTotal() {
    const type = document.getElementById('reservation-type')?.value;
    if (type === 'hotel') {
        updateHotelTotal();
    } else if (type === 'restaurant') {
        updateRestaurantTotal();
    }
}

function updateHotelTotal() {
    const chambre = document.getElementById('chambre');
    const nuits = document.getElementById('nuits');
    const total = document.getElementById('hotel-total');
    
    if (chambre && nuits && total) {
        const selectedRoom = ROOMS.find(r => r.id === chambre.value) || ROOMS[0];
        const nights = parseInt(nuits.value) || 1;
        total.textContent = `${selectedRoom.price * nights}€`;
    }
}

function updateRestaurantTotal() {
    const adultes = parseInt(document.getElementById('adultes')?.value) || 0;
    const enfants = parseInt(document.getElementById('enfants')?.value) || 0;
    const menuSelected = document.querySelector('input[name="menu"]:checked')?.value || 'decouverte';
    
    const price = MENU_PRICES[menuSelected] || 32;
    const total = (adultes * price) + (enfants * price * 0.5);
    
    const totalElement = document.getElementById('restaurant-total');
    if (totalElement) {
        totalElement.textContent = `${total}€`;
    }
}

// Envoi de réservation
async function submitReservation() {
    const typeSelect = document.getElementById('reservation-type');
    if (!typeSelect || !typeSelect.value) {
        showMessage('Veuillez sélectionner un type de réservation', 'error');
        return;
    }
    
    const type = typeSelect.value;
    
    // Vérifier les champs obligatoires
    const nom = document.getElementById('nom')?.value;
    const email = document.getElementById('email')?.value;
    const telephone = document.getElementById('telephone')?.value;
    
    if (!nom || !email || !telephone) {
        showMessage('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    const formData = {
        type: type === 'hotel' ? 'Hôtel' : 'Restaurant',
        nom: nom,
        email: email,
        telephone: telephone,
        demande: document.getElementById('demande')?.value || '',
        date: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
    };
    
    if (type === 'hotel') {
        const chambre = document.getElementById('chambre')?.value;
        const arrivee = document.getElementById('arrivee')?.value;
        const depart = document.getElementById('depart')?.value;
        const adultes = document.getElementById('adultes-hotel')?.value;
        const enfants = document.getElementById('enfants-hotel')?.value;
        
        if (!chambre || !arrivee || !depart) {
            showMessage('Veuillez remplir tous les champs de réservation hôtel', 'error');
            return;
        }
        
        const selectedRoom = ROOMS.find(r => r.id === chambre) || ROOMS[0];
        
        formData.chambre = selectedRoom.name;
        formData.arrivee = arrivee;
        formData.depart = depart;
        formData.nuits = document.getElementById('nuits')?.value || '1';
        formData.adultes = adultes || '2';
        formData.enfants = enfants || '0';
        formData.total = document.getElementById('hotel-total')?.textContent || '0€';
        
    } else if (type === 'restaurant') {
        const dateRestaurant = document.getElementById('date-restaurant')?.value;
        const heure = document.getElementById('heure')?.value;
        const adultes = document.getElementById('adultes')?.value;
        const enfants = document.getElementById('enfants')?.value;
        const menuSelected = document.querySelector('input[name="menu"]:checked');
        
        if (!dateRestaurant || !heure || !adultes || !menuSelected) {
            showMessage('Veuillez remplir tous les champs de réservation restaurant', 'error');
            return;
        }
        
        const menuText = menuSelected.closest('.radio-label')?.querySelector('.radio-text strong')?.textContent || 'Menu Découverte';
        
        formData.date = dateRestaurant;
        formData.heure = heure;
        formData.adultes = adultes;
        formData.enfants = enfants || '0';
        formData.menu = menuText;
        formData.total = document.getElementById('restaurant-total')?.textContent || '0€';
    }
    
    try {
        await sendToDiscord(formData, 'reservation');
        
        showMessage('Votre réservation a bien été enregistrée. Nous vous enverrons une confirmation par email.', 'success');
        
        // Réinitialiser le formulaire
        document.getElementById('reservation-form')?.reset();
        if (type === 'hotel') {
            document.getElementById('hotel-form').style.display = 'none';
        } else {
            document.getElementById('restaurant-form').style.display = 'none';
        }
        document.getElementById('reservation-type').value = '';
        
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.', 'error');
    }
}

function showMessage(text, type) {
    const message = document.getElementById('reservation-message');
    if (message) {
        message.textContent = text;
        message.className = `alert alert-${type}`;
        message.style.display = 'block';
        
        setTimeout(() => {
            message.style.display = 'none';
        }, 5000);
    }
}

// Envoi vers Discord
async function sendToDiscord(data, type) {
    if (WEBHOOK_URL === 'VOTRE_URL_WEBHOOK_DISCORD') {
        console.log('Webhook non configuré');
        return;
    }
    
    const title = type === 'reservation' ? '📅 Nouvelle réservation' : '📧 Nouveau message';
    const color = type === 'reservation' ? 0x2ECC71 : 0x3498DB;
    
    const fields = Object.entries(data).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: value.toString(),
        inline: true
    }));
    
    const embed = {
        title: title,
        color: color,
        fields: fields,
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });
        
        if (!response.ok) {
            throw new Error('Erreur Discord');
        }
    } catch (error) {
        console.error('Erreur Discord:', error);
        throw error;
    }
}

// Navigation vers réservation
function goToReservation(type, option) {
    loadPage('reservation');
    // On pourrait pré-remplir le formulaire ici si nécessaire
}

// Page contact
function initContactPage() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nom = document.getElementById('nom')?.value;
            const email = document.getElementById('email')?.value;
            const sujet = document.getElementById('sujet')?.value;
            const message = document.getElementById('message')?.value;
            
            if (!nom || !email || !sujet || !message) {
                showContactMessage('Veuillez remplir tous les champs obligatoires', 'error');
                return;
            }
            
            const formData = {
                nom: nom,
                email: email,
                telephone: document.getElementById('telephone')?.value || 'Non renseigné',
                sujet: sujet,
                message: message,
                date: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
            };
            
            try {
                await sendToDiscord(formData, 'contact');
                showContactMessage('Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.', 'success');
                form.reset();
                
            } catch (error) {
                showContactMessage('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
            }
        });
    }
}

function showContactMessage(text, type) {
    const message = document.getElementById('contact-message');
    if (message) {
        message.textContent = text;
        message.className = `alert alert-${type}`;
        message.style.display = 'block';
        
        setTimeout(() => {
            message.style.display = 'none';
        }, 5000);
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
        if (message) {
            message.textContent = 'Identifiants incorrects';
            message.style.color = '#dc3545';
        }
    }
}

function showPersonnelSpace() {
    const loginSection = document.getElementById('login-section');
    const personnelSection = document.getElementById('personnel-section');
    
    if (loginSection) loginSection.style.display = 'none';
    if (personnelSection) personnelSection.style.display = 'block';
}

function showPersonnelTab(tabId) {
    // Cacher tous les contenus
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Désactiver tous les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activer le bon onglet
    const tab = document.getElementById(tabId);
    if (tab) {
        tab.classList.add('active');
    }
    
    // Activer le bon bouton
    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(btn => 
        btn.getAttribute('onclick')?.includes(tabId)
    );
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

function logout() {
    localStorage.removeItem('loggedIn');
    location.reload();
}