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
        
        // Réinitialiser les scripts spécifiques à la page
        if (pageName === 'contact') {
            initializeContactForm();
        } else if (pageName === 'personnel') {
            initializePersonnelPage();
        }
        
        // Scroll en haut de la page
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Erreur de chargement:', error);
        mainContent.innerHTML = '<h1>Erreur de chargement de la page</h1>';
    }
}

// Initialisation de la page contact
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

            const messageDiv = document.getElementById('formMessage');
            
            try {
                await sendToDiscord(formData);
                sendEmail(formData);
                
                messageDiv.className = 'message success';
                messageDiv.textContent = 'Message envoyé avec succès !';
                form.reset();
            } catch (error) {
                messageDiv.className = 'message error';
                messageDiv.textContent = 'Erreur lors de l\'envoi du message. Veuillez réessayer.';
                console.error('Erreur:', error);
            }
        });
    }
}

// Envoi vers Discord
async function sendToDiscord(data) {
    if (WEBHOOK_URL === 'VOTRE_URL_WEBHOOK_ICI') {
        console.log('⚠️ Webhook Discord non configuré');
        return;
    }

    const embed = {
        title: `📬 Nouveau message de ${data.nom}`,
        color: 0x667eea,
        fields: [
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
            },
            {
                name: '📋 Sujet',
                value: data.sujet,
                inline: true
            },
            {
                name: '📝 Message',
                value: data.message
            },
            {
                name: '🕐 Date',
                value: data.date,
                inline: true
            }
        ],
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
        console.error('Erreur lors de l\'envoi vers Discord:', error);
        throw error;
    }
}

// Envoi par email
function sendEmail(data) {
    const subject = encodeURIComponent(`[Contact Site] ${data.sujet} - ${data.nom}`);
    const body = encodeURIComponent(
        `Nom: ${data.nom}\n` +
        `Email: ${data.email}\n` +
        `Téléphone: ${data.telephone || 'Non renseigné'}\n` +
        `Sujet: ${data.sujet}\n` +
        `Message: ${data.message}\n` +
        `Date: ${data.date}`
    );
    
    window.location.href = `mailto:contact@leparadis.fr?subject=${subject}&body=${body}`;
}

// Initialisation de la page personnel
function initializePersonnelPage() {
    const loginButton = document.querySelector('.login-form button');
    if (loginButton) {
        loginButton.onclick = login;
    }
    
    // Vérifier si déjà connecté
    if (localStorage.getItem('loggedIn') === 'true') {
        showPersonalSpace();
    }
}

// Fonction de connexion
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

// Afficher l'espace personnel
function showPersonalSpace() {
    const loginForm = document.getElementById('loginForm');
    const personalSpace = document.getElementById('personalSpace');
    
    if (loginForm && personalSpace) {
        loginForm.style.display = 'none';
        personalSpace.style.display = 'block';
        showPersonalTab('protocoles');
    }
}

// Fonction pour afficher les onglets personnels
function showPersonalTab(tabId) {
    document.querySelectorAll('.personal-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const tab = document.getElementById(tabId);
    if (tab) {
        tab.classList.add('active');
    }
}

// Déconnexion
function logout() {
    localStorage.removeItem('loggedIn');
    location.reload();
}