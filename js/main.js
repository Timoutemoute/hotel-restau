// Configuration
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1477392037820239892/5W86pVi9jdBW0V0-oAR8PfQDwFbgrakp8dTL0muiLaNmIzIDogLYcgZ72ppbtGxv-z-l'; // À remplacer par votre URL webhook
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'hotel2024';

// Charger la page d'accueil par défaut
document.addEventListener('DOMContentLoaded', function() {
    loadPage('accueil');
});

// Fonction pour charger les pages
async function loadPage(pageName) {
    const mainContent = document.getElementById('main-content');
    
    try {
        const response = await fetch(`pages/${pageName}.html`);
        const html = await response.text();
        mainContent.innerHTML = html;
        
        // Initialiser les fonctionnalités spécifiques
        if (pageName === 'reservation') {
            initializeReservation();
        } else if (pageName === 'contact') {
            initializeContactForm();
        } else if (pageName === 'personnel') {
            initializePersonnelPage();
        } else if (pageName === 'chambres') {
            initializeRoomButtons();
        } else if (pageName === 'restaurant') {
            initializeRestaurantButtons();
        }
        
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Erreur de chargement:', error);
        mainContent.innerHTML = '<h1>Erreur de chargement de la page</h1>';
    }
}

// Initialisation de la réservation
function initializeReservation() {
    const typeSelect = document.getElementById('reservationType');
    if (typeSelect) {
        typeSelect.addEventListener('change', function() {
            const hotelOptions = document.getElementById('hotelOptions');
            const restaurantOptions = document.getElementById('restaurantOptions');
            
            if (this.value === 'hotel') {
                hotelOptions.style.display = 'block';
                restaurantOptions.style.display = 'none';
            } else if (this.value === 'restaurant') {
                hotelOptions.style.display = 'none';
                restaurantOptions.style.display = 'block';
            }
        });
    }
    
    initializeCounters();
    initializePackages();
    updateTotal();
}

// Compteurs de personnes
function initializeCounters() {
    document.querySelectorAll('.counter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.type;
            const input = document.getElementById(type);
            if (input) {
                let value = parseInt(input.value);
                if (this.classList.contains('plus')) {
                    value++;
                } else if (this.classList.contains('moins') && value > 0) {
                    value--;
                }
                input.value = value;
                updateTotal();
            }
        });
    });
}

// Packages
function initializePackages() {
    document.querySelectorAll('.package-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.package-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            updateTotal();
        });
    });
}

// Calcul du total
function updateTotal() {
    const totalElement = document.getElementById('totalPrice');
    if (!totalElement) return;
    
    let total = 0;
    const type = document.getElementById('reservationType')?.value;
    
    if (type === 'hotel') {
        const nuits = parseInt(document.getElementById('nuits')?.value) || 1;
        const chambre = document.getElementById('chambre')?.value;
        const prixChambre = {
            'standard': 80,
            'superieure': 120,
            'deluxe': 180,
            'suite': 250
        }[chambre] || 80;
        
        total = nuits * prixChambre;
        
    } else if (type === 'restaurant') {
        const adultes = parseInt(document.getElementById('adultes')?.value) || 1;
        const enfants = parseInt(document.getElementById('enfants')?.value) || 0;
        const selectedPackage = document.querySelector('.package-card.selected');
        
        if (selectedPackage) {
            const prix = parseInt(selectedPackage.dataset.price) || 0;
            total = (adultes * prix) + (enfants * prix * 0.5);
        }
    }
    
    totalElement.textContent = total + ' €';
}

// Soumission de réservation
async function submitReservation() {
    const formData = {
        type: document.getElementById('reservationType')?.value,
        nom: document.getElementById('nom')?.value,
        email: document.getElementById('email')?.value,
        telephone: document.getElementById('telephone')?.value,
        date: new Date().toLocaleString('fr-FR')
    };
    
    if (formData.type === 'hotel') {
        formData.chambre = document.getElementById('chambre')?.value;
        formData.arrivee = document.getElementById('arrivee')?.value;
        formData.depart = document.getElementById('depart')?.value;
        formData.nuits = document.getElementById('nuits')?.value;
        formData.adultes = document.getElementById('adultesHotel')?.value;
        formData.enfants = document.getElementById('enfantsHotel')?.value;
    } else if (formData.type === 'restaurant') {
        formData.dateReservation = document.getElementById('dateReservation')?.value;
        formData.heure = document.getElementById('heure')?.value;
        formData.adultes = document.getElementById('adultes')?.value;
        formData.enfants = document.getElementById('enfants')?.value;
        formData.ados = document.getElementById('ados')?.value;
        formData.package = document.querySelector('.package-card.selected h4')?.textContent;
    }
    
    formData.total = document.getElementById('totalPrice')?.textContent;
    
    const message = document.getElementById('reservationMessage');
    
    try {
        await sendToDiscord(formData, 'reservation');
        message.className = 'message success';
        message.textContent = 'Réservation envoyée avec succès ! Nous vous contacterons rapidement.';
        document.getElementById('reservationForm')?.reset();
    } catch (error) {
        message.className = 'message error';
        message.textContent = 'Erreur lors de l\'envoi de la réservation.';
    }
}

// Initialisation du formulaire de contact
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                nom: document.getElementById('nom').value,
                email: document.getElementById('email').value,
                telephone: document.getElementById('telephone').value,
                sujet: document.getElementById('sujet').value,
                message: document.getElementById('message').value,
                date: new Date().toLocaleString('fr-FR')
            };
            
            // Ajouter les champs conditionnels
            if (formData.sujet === 'reservation') {
                formData.typeReservation = document.getElementById('typeReservation').value;
                if (formData.typeReservation === 'hotel') {
                    formData.periode = document.getElementById('periode').value;
                } else {
                    formData.dateReservation = document.getElementById('dateReservationContact').value;
                }
            }
            
            const messageDiv = document.getElementById('formMessage');
            
            try {
                await sendToDiscord(formData, 'contact');
                
                messageDiv.className = 'message success';
                messageDiv.textContent = 'Message envoyé avec succès !';
                form.reset();
                
                // Cacher les champs conditionnels
                document.getElementById('reservationFields')?.classList.add('hidden');
            } catch (error) {
                messageDiv.className = 'message error';
                messageDiv.textContent = 'Erreur lors de l\'envoi du message.';
            }
        });
    }
}

// Envoi vers Discord
async function sendToDiscord(data, type) {
    if (WEBHOOK_URL === 'VOTRE_URL_WEBHOOK_ICI') {
        console.log('⚠️ Webhook Discord non configuré');
        return;
    }
    
    const title = type === 'reservation' ? '📅 Nouvelle réservation' : '📬 Nouveau message de contact';
    const color = type === 'reservation' ? 0x2ECC71 : 0x3498DB;
    
    const fields = [
        {
            name: '👤 Nom',
            value: data.nom,
            inline: true
        },
        {
            name: '📧 Email',
            value: data.email,
            inline: true
        },
        {
            name: '📞 Téléphone',
            value: data.telephone || 'Non renseigné',
            inline: true
        }
    ];
    
    if (type === 'reservation') {
        fields.push(
            {
                name: '🏨 Type',
                value: data.type === 'hotel' ? 'Hôtel' : 'Restaurant',
                inline: true
            }
        );
        
        if (data.type === 'hotel') {
            fields.push(
                {
                    name: '🛏️ Chambre',
                    value: data.chambre,
                    inline: true
                },
                {
                    name: '📅 Arrivée',
                    value: data.arrivee,
                    inline: true
                },
                {
                    name: '📅 Départ',
                    value: data.depart,
                    inline: true
                },
                {
                    name: '👥 Personnes',
                    value: `Adultes: ${data.adultes}, Enfants: ${data.enfants}`,
                    inline: true
                }
            );
        } else {
            fields.push(
                {
                    name: '📅 Date',
                    value: data.dateReservation,
                    inline: true
                },
                {
                    name: '⏰ Heure',
                    value: data.heure,
                    inline: true
                },
                {
                    name: '👥 Personnes',
                    value: `Adultes: ${data.adultes}, Enfants: ${data.enfants}, Ados: ${data.ados}`,
                    inline: true
                },
                {
                    name: '🍽️ Menu',
                    value: data.package,
                    inline: true
                }
            );
        }
        
        fields.push({
            name: '💰 Total',
            value: data.total,
            inline: true
        });
    } else {
        fields.push(
            {
                name: '📋 Sujet',
                value: data.sujet,
                inline: true
            },
            {
                name: '📝 Message',
                value: data.message
            }
        );
        
        if (data.sujet === 'reservation') {
            if (data.typeReservation === 'hotel') {
                fields.push({
                    name: '📅 Période souhaitée',
                    value: data.periode,
                    inline: true
                });
            } else {
                fields.push({
                    name: '📅 Date souhaitée',
                    value: data.dateReservation,
                    inline: true
                });
            }
        }
    }
    
    fields.push({
        name: '🕐 Date d\'envoi',
        value: data.date,
        inline: true
    });
    
    const embed = {
        title: title,
        color: color,
        fields: fields,
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ embeds: [embed] })
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
    } catch (error) {
        console.error('Erreur Discord:', error);
        throw error;
    }
}

// Initialisation page personnel
function initializePersonnelPage() {
    const loginButton = document.querySelector('.login-form button');
    if (loginButton) {
        loginButton.onclick = login;
    }
    
    if (localStorage.getItem('loggedIn') === 'true') {
        showPersonalSpace();
    }
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage');
    
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        localStorage.setItem('loggedIn', 'true');
        showPersonalSpace();
        loginMessage.textContent = '';
    } else {
        loginMessage.textContent = 'Identifiants incorrects';
    }
}

function showPersonalSpace() {
    const loginForm = document.getElementById('loginForm');
    const personalSpace = document.getElementById('personalSpace');
    
    if (loginForm && personalSpace) {
        loginForm.style.display = 'none';
        personalSpace.style.display = 'block';
        showPersonalTab('protocoles');
    }
}

function showPersonalTab(tabId) {
    document.querySelectorAll('.personal-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const tab = document.getElementById(tabId);
    if (tab) {
        tab.classList.add('active');
    }
}

function logout() {
    localStorage.removeItem('loggedIn');
    location.reload();
}

function initializeRoomButtons() {
    // Initialisation des boutons de réservation sur les chambres
}

function initializeRestaurantButtons() {
    // Initialisation des boutons de réservation sur le restaurant
}

function goToReservation(type, params = {}) {
    loadPage('reservation');
    // Ici on pourrait pré-remplir le formulaire selon les params
}