# Guide de Démarrage Rapide

Ce guide vous accompagne pas à pas pour configurer et lancer votre application de domotique.

## Temps estimé : 15-20 minutes

---

## Étape 1 : Installation (5 min)

### 1.1 Installer Node.js

Si vous n'avez pas Node.js installé :

**Windows / Mac :**
- Téléchargez depuis [nodejs.org](https://nodejs.org)
- Installez la version LTS (recommandée)
- Vérifiez l'installation :
  ```bash
  node --version
  npm --version
  ```

**Linux :**
```bash
sudo apt update
sudo apt install nodejs npm
```

### 1.2 Installer les dépendances du projet

```bash
cd domo
npm run install-all
```

Attendez que toutes les dépendances soient installées (peut prendre 2-3 minutes).

---

## Étape 2 : Configuration Tuya (10 min)

### 2.1 Créer un compte développeur Tuya

1. Ouvrez [https://iot.tuya.com](https://iot.tuya.com) dans votre navigateur
2. Cliquez sur **Sign Up** (ou **Sign In** si vous avez déjà un compte)
3. Créez votre compte développeur
4. Confirmez votre email

### 2.2 Créer un projet Cloud

1. Une fois connecté, allez dans **Cloud** → **Development**
2. Cliquez sur **Create Cloud Project** (bouton bleu en haut à droite)
3. Remplissez le formulaire :
   ```
   Project Name:        Ma Domotique
   Description:         Application de contrôle des appareils Smart Life
   Industry:            Smart Home
   Development Method:  Custom
   Data Center:         Western Europe Data Center (si vous êtes en Europe)
   ```
4. Cliquez sur **Create**

### 2.3 Récupérer vos identifiants API

1. Vous êtes maintenant sur la page de votre projet
2. Restez sur l'onglet **Overview**
3. Notez ces deux informations (copiez-les dans un fichier temporaire) :
   - **Access ID/Client ID** : commence par "abc..." (environ 20 caractères)
   - **Access Secret/Client Secret** : commence par "abc..." (environ 32 caractères)

### 2.4 Activer les API nécessaires

1. Cliquez sur l'onglet **API** (dans le menu du projet)
2. Dans la barre de recherche, tapez "Smart Home"
3. Trouvez **Smart Home Basic Service** ou **Smart Home Device Management**
4. Cliquez sur **Subscribe** ou **Enable**
5. Si vous voyez un bouton **Go Live**, cliquez dessus

### 2.5 Lier votre compte Smart Life

**IMPORTANT : Cette étape est cruciale !**

1. Dans le menu du projet, allez dans **Devices** → **Link Tuya App Account**
2. Cliquez sur **Add App Account**
3. Un QR code apparaît
4. Sur votre smartphone :
   - Ouvrez l'application **Smart Life**
   - Appuyez sur **Moi** ou **Profil** (en bas à droite)
   - Appuyez sur l'icône **Paramètres** (⚙️ en haut à droite)
   - Cherchez et appuyez sur **Scan QR Code**
   - Scannez le QR code affiché sur votre ordinateur
5. Autorisez la connexion sur votre téléphone
6. De retour sur votre ordinateur, vous devriez voir votre compte apparaître
7. **Notez le User ID (UID)** affiché (format : eu123456789...)

---

## Étape 3 : Configuration de l'application (3 min)

### 3.1 Configurer le backend

1. Ouvrez le dossier du projet dans un éditeur de texte (Notepad++, VS Code, etc.)
2. Allez dans le dossier `backend/`
3. Copiez le fichier `.env.example` et renommez la copie en `.env`
   - Ou en ligne de commande : `cp backend/.env.example backend/.env`
4. Ouvrez le fichier `.env` avec un éditeur de texte
5. Remplacez les valeurs :

```env
TUYA_CLIENT_ID=COLLEZ_ICI_VOTRE_ACCESS_ID
TUYA_CLIENT_SECRET=COLLEZ_ICI_VOTRE_ACCESS_SECRET
TUYA_USER_ID=COLLEZ_ICI_VOTRE_USER_ID

# Si vous êtes en Europe, laissez eu
# Sinon : us (États-Unis), cn (Chine), in (Inde)
TUYA_REGION=eu

PORT=3001
```

6. **Sauvegardez** le fichier

**Exemple de fichier .env complété :**
```env
TUYA_CLIENT_ID=abc3xk9d8fm5kp6qr2tn
TUYA_CLIENT_SECRET=7h8j2n3k5m6p8q9r1s4t6v7x9y0z1a2b
TUYA_USER_ID=eu1234567890abcdef

TUYA_REGION=eu

PORT=3001
```

---

## Étape 4 : Lancer l'application (1 min)

### 4.1 Démarrer l'application

Ouvrez un terminal dans le dossier du projet et lancez :

```bash
npm run dev
```

Vous devriez voir :
```
🚀 Serveur démarré sur http://localhost:3001
📡 API disponible sur http://localhost:3001/api
🔄 Démarrage de la surveillance des appareils...
✅ Token Tuya obtenu avec succès
✅ Cache mis à jour: X appareils

> dev
> vite

  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
```

### 4.2 Ouvrir l'application

Ouvrez votre navigateur et allez à :

👉 **http://localhost:3000**

---

## Étape 5 : Première utilisation

### 5.1 Configuration initiale

Si vous voyez une fenêtre de configuration :
1. Entrez votre **User ID** (celui récupéré à l'étape 2.5)
2. Cliquez sur **Enregistrer**

### 5.2 Vérifier que vos appareils apparaissent

Vous devriez maintenant voir :
- ✅ Tous vos appareils Smart Life affichés en cartes
- ✅ Leur état (allumé/éteint, en ligne/hors ligne)
- ✅ Leur consommation en temps réel
- ✅ Les graphiques de consommation en bas

### 5.3 Tester le contrôle

1. Cliquez sur le bouton **Allumer** ou **Éteindre** d'un appareil
2. L'appareil devrait réagir dans les 2-3 secondes
3. La consommation devrait s'afficher

---

## Résolution de problèmes

### ❌ "Erreur de connexion" ou "Impossible de récupérer les appareils"

**Vérifications :**
1. ✅ Le backend est bien lancé (vérifiez le terminal)
2. ✅ Les identifiants dans `.env` sont corrects (pas d'espace avant/après)
3. ✅ Vous avez bien lié votre compte Smart Life (étape 2.5)
4. ✅ Les API sont activées dans votre projet Tuya

**Solution :**
- Arrêtez l'application (Ctrl+C)
- Vérifiez à nouveau le fichier `.env`
- Relancez `npm run dev`

### ❌ "Aucun appareil trouvé"

**Causes possibles :**
1. User ID incorrect → Retournez sur Tuya IoT Platform pour le vérifier
2. Compte Smart Life non lié → Refaites l'étape 2.5
3. Région incorrecte → Vérifiez `TUYA_REGION` dans `.env`

### ❌ Le backend ne démarre pas

**Vérifiez :**
```bash
# Êtes-vous dans le bon dossier ?
pwd  # Devrait afficher: .../domo

# Les dépendances sont installées ?
npm run install-all
```

### ❌ Port 3000 ou 3001 déjà utilisé

**Solution :**
1. Fermez les autres applications qui utilisent ce port
2. Ou modifiez le port dans :
   - Backend : `.env` → changez `PORT=3001` en `PORT=3002`
   - Frontend : `vite.config.js` → changez `port: 3000` en `port: 3003`

### ❌ Consommation affichée à 0 W

**C'est normal si :**
- L'appareil est éteint
- Votre prise ne supporte pas la mesure de consommation

**Vérifiez :**
- Que l'appareil est allumé
- Que votre prise a bien la fonction "mesure d'énergie"
- Dans l'app Smart Life, vérifiez si vous voyez la consommation

---

## Commandes utiles

```bash
# Lancer l'application (recommandé)
npm run dev

# Lancer uniquement le backend
cd backend && npm run dev

# Lancer uniquement le frontend
cd frontend && npm run dev

# Arrêter l'application
Ctrl + C (dans le terminal)

# Réinstaller les dépendances (si problème)
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install-all
```

---

## Prochaines étapes

Une fois que tout fonctionne :

1. **Personnalisez vos appareils** : Renommez-les dans Smart Life pour des noms plus courts
2. **Testez avec Google Assistant** : "Ok Google, allume [nom de l'appareil]"
3. **Surveillez la consommation** : Identifiez les appareils gourmands
4. **Explorez l'interface** : Graphiques, rafraîchissement, etc.

---

## Besoin d'aide ?

1. Consultez le fichier `README.md` pour plus de détails
2. Vérifiez les logs dans le terminal
3. Vérifiez la console du navigateur (F12)
4. Assurez-vous que tous vos identifiants Tuya sont corrects

---

🎉 **Félicitations ! Votre application de domotique est prête !** 🎉

Profitez du contrôle et de la surveillance de vos appareils Smart Life !
