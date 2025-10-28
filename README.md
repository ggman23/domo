# 🏠 Application de Domotique - Smart Life / Tuya

Application web moderne et complète pour contrôler vos appareils Smart Life (Tuya) avec affichage en temps réel de la consommation électrique.

**✨ NOUVELLE VERSION : Accès depuis n'importe où (téléphone, tablette, internet) !**

---

## 🚀 Démarrage Ultra-Rapide

### L'application est déjà configurée avec vos identifiants Tuya !

```bash
# 1. Installer les dépendances (3 minutes)
npm run install-all

# 2. Lancer l'application (c'est tout !)
npm run dev
```

📖 **Guide détaillé** : Consultez [DEMARRAGE_RAPIDE.md](DEMARRAGE_RAPIDE.md)

---

## ✨ Fonctionnalités

### Contrôle et Surveillance
- ✅ Affichage de tous vos appareils Smart Life
- ✅ État en temps réel (allumé/éteint, en ligne/hors ligne)
- ✅ Consommation électrique en direct (Watt, Ampère, Volt)
- ✅ Contrôle des appareils depuis l'interface
- ✅ Graphiques de consommation avec coût estimé
- ✅ Affichage des commandes Google Assistant
- ✅ Interface responsive et moderne

### Accès Multi-Plateformes
- 📱 **Téléphones et tablettes** (même WiFi)
- 💻 **Ordinateurs** (réseau local)
- 🌐 **Internet** (depuis n'importe où dans le monde)
- 👨‍👩‍👧‍👦 **Multi-utilisateurs** (toute la famille)

### Automatisation
- 🔄 Actualisation automatique toutes les 30 secondes
- 🤖 Récupération automatique du User ID
- ⚡ Configuration automatique au premier lancement

---

## 📱 Types d'accès disponibles

### 1. Accès LOCAL (ordinateur)
```
http://localhost:3000
```
- Sur votre ordinateur uniquement
- Idéal pour les tests

### 2. Accès RÉSEAU (WiFi familial)
```
http://192.168.X.X:3000
```
- Tous les téléphones/tablettes sur le même WiFi
- **URL affichée au démarrage du serveur**
- Aucune configuration nécessaire !

### 3. Accès INTERNET (depuis partout)
```bash
npm run tunnel
```
- Depuis n'importe où dans le monde
- 4G, autres WiFi, etc.
- URL publique sécurisée (HTTPS)

📖 **Guide complet** : [ACCES_INTERNET.md](ACCES_INTERNET.md)

---

## 🛠 Technologies utilisées

### Backend
- Node.js + Express
- API Tuya IoT Platform
- Configuration automatique
- Mise à jour automatique toutes les 30 secondes

### Frontend
- React + Vite
- Recharts (graphiques)
- Lucide React (icônes)
- CSS moderne avec animations
- Responsive design

---

## 📂 Structure du projet

```
domo/
├── backend/                    # Serveur Node.js
│   ├── config/                # Configuration API Tuya
│   ├── routes/                # Routes API
│   ├── services/              # Services (monitoring, auto-config)
│   ├── .env                   # ✅ DÉJÀ CONFIGURÉ avec vos identifiants
│   └── server.js              # Point d'entrée
│
├── frontend/                  # Application React
│   ├── src/
│   │   ├── components/       # Composants React
│   │   ├── services/         # Services API
│   │   ├── App.jsx           # Composant principal
│   │   └── main.jsx          # Point d'entrée
│   └── index.html
│
├── scripts/                   # Scripts utilitaires
│   ├── tunnel.sh             # Tunnel Linux/Mac
│   ├── tunnel.bat            # Tunnel Windows
│   ├── check-tunnel.js       # Vérification tunnel
│   └── deploy.sh             # Script de déploiement
│
├── DEMARRAGE_RAPIDE.md       # ⭐ Commencez ici !
├── ACCES_INTERNET.md         # Guide accès Internet
├── GUIDE_DEMARRAGE.md        # Guide détaillé complet
└── README.md                 # Ce fichier
```

---

## 🎯 Comment ça marche ?

### 1. Configuration Automatique

Au premier lancement, l'application :
1. Se connecte à votre compte Tuya avec vos identifiants
2. Récupère automatiquement votre User ID
3. Charge tous vos appareils Smart Life
4. Affiche les URLs d'accès

**Aucune configuration manuelle nécessaire !**

### 2. Accès Réseau Local

Le serveur écoute sur `0.0.0.0:3000`, ce qui signifie :
- Accessible depuis n'importe quel appareil sur votre WiFi
- L'URL est affichée au démarrage
- CORS configuré pour accepter toutes les origines

### 3. Tunnel Internet (optionnel)

Utilise Cloudflare Tunnel pour créer une URL publique :
- Gratuit et sécurisé (HTTPS)
- Aucune configuration réseau
- Pas besoin d'ouvrir de ports

---

## 📖 Documentation

- **[DEMARRAGE_RAPIDE.md](DEMARRAGE_RAPIDE.md)** - ⭐ Commencez ici ! (3 minutes)
- **[ACCES_INTERNET.md](ACCES_INTERNET.md)** - Guide complet pour l'accès Internet
- **[GUIDE_DEMARRAGE.md](GUIDE_DEMARRAGE.md)** - Guide détaillé de configuration

---

## 🔒 Sécurité

### Déjà en place
- ✅ Configuration .env (non commitée dans Git)
- ✅ CORS configuré
- ✅ HTTPS automatique avec les tunnels

### Recommandations
- 🔐 Utilisez un VPN pour accès Internet
- 🔑 Ajoutez une authentification si exposé publiquement
- 🔄 Gardez les dépendances à jour
- 📝 Surveillez les logs pour détecter les connexions suspectes

📖 Voir [ACCES_INTERNET.md](ACCES_INTERNET.md) pour ajouter une authentification

---

## ⚡ Commandes rapides

```bash
# Lancer l'application
npm run dev

# Lancer uniquement le backend
npm run dev:backend

# Lancer uniquement le frontend
npm run dev:frontend

# Créer un tunnel Internet
npm run tunnel

# Réinstaller toutes les dépendances
npm run install-all
```

---

## 🎨 Personnalisation

### Changer le tarif électrique

Dans `frontend/src/components/ConsumptionChart.jsx` et `DeviceCard.jsx`, modifiez :
```javascript
const tarifKwh = 0.15; // Changez cette valeur (€/kWh)
```

### Ajouter des icônes d'appareils

Dans `frontend/src/components/DeviceCard.jsx`, modifiez l'objet `DEVICE_ICONS` :
```javascript
const DEVICE_ICONS = {
  tv: Tv,
  votre_appareil: VotreIcone,
  // ...
};
```

### Modifier l'intervalle de mise à jour

Dans `backend/services/deviceMonitor.js`, modifiez le cron :
```javascript
cron.schedule('*/30 * * * * *', () => { // Actuellement 30 secondes
```

---

## 🐛 Dépannage

### L'application ne démarre pas
```bash
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install-all
```

### Aucun appareil n'apparaît
1. Vérifiez vos identifiants dans `backend/.env`
2. Attendez 30 secondes (rechargement auto)
3. Vérifiez les logs du backend
4. Assurez-vous d'avoir des appareils dans Smart Life

### Erreur "Cannot find module"
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Le téléphone ne peut pas accéder
1. Vérifiez que vous êtes sur le même WiFi
2. Utilisez l'URL exacte affichée au démarrage
3. Désactivez temporairement le pare-feu
4. Essayez `http://` au lieu de `https://`

### La consommation affiche 0 W
- L'appareil doit être allumé
- Votre prise doit avoir la mesure d'énergie
- Certains appareils ne supportent pas cette fonction

---

## 📊 API Backend

Le backend expose plusieurs endpoints :

### Appareils
- `GET /api/tuya/devices/:userId` - Liste tous les appareils
- `GET /api/tuya/device/:deviceId` - Informations d'un appareil
- `GET /api/tuya/device/:deviceId/status` - Statut d'un appareil

### Contrôle
- `POST /api/tuya/device/:deviceId/on` - Allumer un appareil
- `POST /api/tuya/device/:deviceId/off` - Éteindre un appareil
- `POST /api/tuya/device/:deviceId/control` - Contrôle personnalisé

### Système
- `GET /api/health` - Vérification du serveur
- `GET /api/info` - Informations serveur et URLs d'accès

---

## 🎓 Données de consommation

L'application récupère plusieurs métriques :

- **cur_power** : Puissance actuelle (Watt)
- **cur_voltage** : Tension actuelle (Volt)
- **cur_current** : Courant actuel (Ampère)

Le coût estimé est basé sur **0,15 €/kWh** (modifiable).

---

## 🎯 Commandes Google Assistant

L'application affiche les commandes suggérées pour chaque appareil :

- **Allumer** : "Ok Google, allume [nom de l'appareil]"
- **Éteindre** : "Ok Google, éteins [nom de l'appareil]"

Ces commandes fonctionnent car vos appareils Smart Life sont déjà liés à Google Home.

---

## 🚀 Développement futur

Fonctionnalités possibles à ajouter :

- [ ] Historique de consommation sur plusieurs jours/semaines
- [ ] Notifications push
- [ ] Planification d'allumage/extinction
- [ ] Scénarios et automatisations
- [ ] Support d'autres types d'appareils (thermostats, caméras)
- [ ] Mode sombre
- [ ] Application mobile native (React Native)
- [ ] Comparaison de consommation
- [ ] Statistiques mensuelles

---

## 📱 Ajouter à l'écran d'accueil

### iPhone (Safari)
1. Ouvrez l'URL dans Safari
2. Bouton "Partager" → "Sur l'écran d'accueil"
3. Nommez "Ma Domotique"

### Android (Chrome)
1. Ouvrez l'URL dans Chrome
2. Menu (⋮) → "Ajouter à l'écran d'accueil"
3. Nommez "Ma Domotique"

L'application se comportera comme une app native !

---

## 🔗 Ressources

- [Documentation Tuya IoT Platform](https://developer.tuya.com/en/docs/iot)
- [Tuya OpenAPI Reference](https://developer.tuya.com/en/docs/cloud/api-reference)
- [Smart Life App](https://www.tuya.com/smart-life)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)

---

## 📝 Licence

MIT

---

## 🙏 Support

En cas de problème :
1. Consultez [DEMARRAGE_RAPIDE.md](DEMARRAGE_RAPIDE.md)
2. Vérifiez les logs du backend (terminal)
3. Consultez la console du navigateur (F12)
4. Assurez-vous que vos identifiants sont corrects
5. Vérifiez que vos appareils sont dans Smart Life

---

## ⭐ Fonctionnalités en un coup d'œil

| Fonctionnalité | Status |
|----------------|--------|
| Affichage des appareils | ✅ |
| État en temps réel | ✅ |
| Consommation électrique | ✅ |
| Contrôle on/off | ✅ |
| Graphiques | ✅ |
| Accès réseau local | ✅ |
| Accès Internet | ✅ |
| Auto-configuration | ✅ |
| Responsive design | ✅ |
| Multi-utilisateurs | ✅ |

---

🏠 **Créé avec React, Node.js et l'API Tuya IoT Platform**

🎉 **Profitez de votre domotique accessible partout !**
