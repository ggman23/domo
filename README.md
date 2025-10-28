# Application de Domotique - Smart Life / Tuya

Application web moderne pour contrôler vos appareils Smart Life (Tuya) avec affichage en temps réel de la consommation électrique.

## Fonctionnalités

- Affichage de tous vos appareils Smart Life
- État en temps réel (allumé/éteint, en ligne/hors ligne)
- Consommation électrique en direct (Watt, Ampère, Volt)
- Contrôle des appareils depuis l'interface
- Graphiques de consommation
- Affichage des commandes Google Assistant
- Interface responsive et moderne

## Technologies utilisées

### Backend
- Node.js + Express
- API Tuya IoT Platform
- Mise à jour automatique toutes les 30 secondes

### Frontend
- React + Vite
- Recharts (graphiques)
- Lucide React (icônes)
- CSS moderne avec animations

## Installation

### Prérequis
- Node.js (version 16 ou supérieure)
- Un compte Smart Life avec des appareils configurés
- Un compte développeur Tuya IoT Platform

### Étape 1 : Cloner le projet

```bash
git clone <url-du-repo>
cd domo
```

### Étape 2 : Installer les dépendances

```bash
npm run install-all
```

Cette commande installe les dépendances pour le projet racine, le backend et le frontend.

## Configuration Tuya IoT Platform

### 1. Créer un compte développeur Tuya

1. Allez sur [https://iot.tuya.com](https://iot.tuya.com)
2. Créez un compte ou connectez-vous
3. Complétez votre profil si nécessaire

### 2. Créer un projet Cloud

1. Dans le menu, allez dans **Cloud** → **Development**
2. Cliquez sur **Create Cloud Project**
3. Remplissez les informations :
   - **Project Name** : "My Smart Home" (ou autre nom)
   - **Description** : "Application de contrôle domotique"
   - **Industry** : Smart Home
   - **Development Method** : Custom
   - **Data Center** : Choisissez votre région (Europe = EU)
4. Cliquez sur **Create**

### 3. Récupérer les identifiants API

1. Dans votre projet, allez dans l'onglet **Overview**
2. Notez ces informations :
   - **Client ID** (aussi appelé Access ID)
   - **Client Secret** (aussi appelé Access Secret)
3. Gardez-les en sécurité !

### 4. Lier votre compte Smart Life

1. Dans votre projet, allez dans **Devices** → **Link Tuya App Account**
2. Cliquez sur **Add App Account**
3. Scannez le QR code avec l'application Smart Life :
   - Ouvrez Smart Life sur votre téléphone
   - Allez dans **Profil** → **Paramètres** (icône en haut à droite)
   - Cliquez sur **Scan QR Code**
   - Scannez le QR code affiché sur la page web
4. Une fois lié, notez votre **User ID** (UID) affiché dans la liste

### 5. Activer les APIs nécessaires

1. Dans votre projet, allez dans l'onglet **API**
2. Cherchez et activez ces API groups :
   - **Authorization** (activée par défaut)
   - **Smart Home Device Management**
   - **Device Status Notification** (optionnel mais recommandé)
3. Cliquez sur **Go Live** si demandé

## Configuration de l'application

### Backend

1. Copiez le fichier d'exemple :
```bash
cd backend
cp .env.example .env
```

2. Éditez le fichier `.env` avec vos identifiants :
```env
# Configuration Tuya IoT Platform
TUYA_CLIENT_ID=votre_client_id_ici
TUYA_CLIENT_SECRET=votre_client_secret_ici
TUYA_USER_ID=votre_user_id_ici

# Région de votre compte (eu, us, cn, in)
TUYA_REGION=eu

# Port du serveur
PORT=3001
```

**Important** : Remplacez les valeurs par vos vraies informations !

### Frontend

La configuration du frontend se fait directement dans l'interface au premier lancement, mais vous pouvez aussi entrer votre User ID manuellement.

## Lancement de l'application

### Option 1 : Lancement automatique (recommandé)

Depuis le dossier racine du projet :

```bash
npm run dev
```

Cette commande lance simultanément le backend et le frontend.

### Option 2 : Lancement manuel

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

## Utilisation

1. Ouvrez votre navigateur à l'adresse : [http://localhost:3000](http://localhost:3000)

2. Si c'est votre première utilisation, une fenêtre de configuration apparaîtra
   - Entrez votre **User ID Tuya**
   - Cliquez sur **Enregistrer**

3. Vos appareils devraient apparaître automatiquement

4. Vous pouvez maintenant :
   - Voir l'état de vos appareils (allumé/éteint)
   - Voir la consommation en temps réel
   - Allumer/éteindre vos appareils en un clic
   - Consulter les graphiques de consommation
   - Voir les commandes Google Assistant associées

## Structure du projet

```
domo/
├── backend/                 # Serveur Node.js
│   ├── config/             # Configuration Tuya API
│   ├── routes/             # Routes API
│   ├── services/           # Services (monitoring, etc.)
│   ├── .env                # Variables d'environnement (à créer)
│   └── server.js           # Point d'entrée
│
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── services/      # Services API
│   │   ├── App.jsx        # Composant principal
│   │   └── main.jsx       # Point d'entrée
│   └── index.html
│
└── README.md
```

## API Backend

Le backend expose plusieurs endpoints :

### Appareils
- `GET /api/tuya/devices/:userId` - Liste tous les appareils
- `GET /api/tuya/device/:deviceId` - Informations d'un appareil
- `GET /api/tuya/device/:deviceId/status` - Statut d'un appareil

### Contrôle
- `POST /api/tuya/device/:deviceId/on` - Allumer un appareil
- `POST /api/tuya/device/:deviceId/off` - Éteindre un appareil
- `POST /api/tuya/device/:deviceId/control` - Contrôle personnalisé

### Santé
- `GET /api/health` - Vérification du serveur

## Données de consommation

L'application récupère plusieurs métriques de vos prises connectées :

- **cur_power** : Puissance actuelle (en dixièmes de Watt)
- **cur_voltage** : Tension actuelle (en dixièmes de Volt)
- **cur_current** : Courant actuel (en milliampères)

Le coût estimé est calculé sur la base de **0,15 €/kWh** (tarif moyen en France).

## Commandes Google Assistant

L'application affiche les commandes Google Assistant suggérées pour chaque appareil :

- **Allumer** : "Ok Google, allume [nom de l'appareil]"
- **Éteindre** : "Ok Google, éteins [nom de l'appareil]"

Ces commandes fonctionnent directement avec Google Home car vos appareils Smart Life sont déjà liés.

## Dépannage

### Les appareils n'apparaissent pas

1. Vérifiez que vos identifiants Tuya sont corrects dans le fichier `.env`
2. Vérifiez que votre User ID est correct
3. Vérifiez que vous avez bien lié votre compte Smart Life sur Tuya IoT Platform
4. Vérifiez que les APIs sont activées dans votre projet Tuya
5. Regardez les logs du backend dans la console

### Erreur "403 Forbidden"

- Vos identifiants API sont incorrects ou votre projet n'est pas activé
- Vérifiez que vous avez activé les bonnes API Groups

### Erreur "1004" ou "1106"

- Le token d'accès a expiré ou est invalide
- Relancez le serveur backend

### La consommation affiche 0 W

- Certaines prises connectées ne supportent pas la mesure de consommation
- Vérifiez que votre prise a bien la fonction de mesure d'énergie
- L'appareil doit être allumé pour afficher une consommation

### Les commandes on/off ne fonctionnent pas

- Vérifiez que l'appareil est en ligne (icône WiFi verte)
- Certains appareils utilisent des codes différents de `switch_1`
- Regardez les logs du backend pour voir les codes disponibles

## Personnalisation

### Changer le tarif électrique

Dans `frontend/src/components/ConsumptionChart.jsx` et `DeviceCard.jsx`, modifiez la valeur `0.15` par votre tarif en €/kWh.

### Ajouter des icônes d'appareils

Dans `frontend/src/components/DeviceCard.jsx`, modifiez l'objet `DEVICE_ICONS` pour ajouter vos propres icônes selon les noms d'appareils.

### Modifier l'intervalle de mise à jour

Dans `backend/services/deviceMonitor.js`, modifiez le cron schedule (actuellement `*/30 * * * * *` = 30 secondes).

## Sécurité

- **Ne partagez jamais** vos `Client ID` et `Client Secret`
- Ne commitez **jamais** le fichier `.env` dans Git
- Utilisez HTTPS en production
- Limitez l'accès à votre application (pare-feu, VPN, etc.)

## Développement futur

Fonctionnalités possibles à ajouter :

- Historique de consommation sur plusieurs jours
- Notifications push quand un appareil est allumé trop longtemps
- Planification d'allumage/extinction
- Scénarios et automatisations
- Support d'autres types d'appareils (thermostats, caméras, etc.)
- Mode sombre
- Application mobile (React Native)

## Ressources

- [Documentation Tuya IoT Platform](https://developer.tuya.com/en/docs/iot)
- [Tuya OpenAPI Reference](https://developer.tuya.com/en/docs/cloud/api-reference)
- [Smart Life App](https://www.tuya.com/smart-life)

## Licence

MIT

## Support

En cas de problème, vérifiez :
1. Les logs du backend (terminal où tourne `npm run dev`)
2. La console du navigateur (F12 → Console)
3. Que tous vos identifiants sont corrects

---

Créé avec React, Node.js et l'API Tuya IoT Platform
