# 🚀 Déploiement sur Vercel - Guide Complet

Ce guide vous explique comment déployer votre application de domotique sur Vercel en quelques clics.

## ⏱️ Temps nécessaire : 5 minutes

---

## 📋 Prérequis

- ✅ Un compte Vercel (gratuit) : [https://vercel.com](https://vercel.com)
- ✅ Vos identifiants Tuya (déjà dans le projet)
- ✅ Un compte GitHub/GitLab/Bitbucket (optionnel mais recommandé)

---

## 🎯 Méthode 1 : Déploiement depuis GitHub (Recommandé)

### Étape 1 : Pousser le code sur GitHub

Si ce n'est pas déjà fait :

```bash
# Le code est déjà sur Git
git push origin claude/session-011CUa7rhqoeaqEnyszXmrdk
```

### Étape 2 : Connecter Vercel à GitHub

1. Allez sur [https://vercel.com](https://vercel.com)
2. Cliquez sur **Log in** ou **Sign Up**
3. Choisissez **Continue with GitHub**
4. Autorisez Vercel à accéder à vos repositories

### Étape 3 : Importer le projet

1. Sur le dashboard Vercel, cliquez sur **Add New...** → **Project**
2. Trouvez votre repository `domo` dans la liste
3. Cliquez sur **Import**

### Étape 4 : Configurer le projet

Vercel détecte automatiquement la configuration. Vérifiez :

**Build & Development Settings :**
- Framework Preset : **Vite** (détecté automatiquement)
- Build Command : `cd frontend && npm install && npm run build`
- Output Directory : `frontend/dist`
- Install Command : `npm install`

**Root Directory :** Laissez `.` (racine)

### Étape 5 : Ajouter les variables d'environnement

C'est l'étape **CRUCIALE** ! Cliquez sur **Environment Variables** :

Ajoutez ces 3 variables :

| Name | Value |
|------|-------|
| `TUYA_CLIENT_ID` | `ktuq7y5tgtw5433v8r4s` |
| `TUYA_CLIENT_SECRET` | `74c7023cc90946128ca8b6f887a4e5cb` |
| `TUYA_REGION` | `eu` |

**Important :** Assurez-vous qu'elles sont disponibles pour :
- ✅ Production
- ✅ Preview
- ✅ Development

### Étape 6 : Déployer !

1. Cliquez sur **Deploy**
2. Attendez 2-3 minutes (Vercel compile et déploie)
3. 🎉 Votre application est en ligne !

### Étape 7 : Obtenir l'URL

Une fois le déploiement terminé :

```
https://votre-projet.vercel.app
```

✨ **C'est terminé !** Partagez cette URL avec votre famille !

---

## 🎯 Méthode 2 : Déploiement direct avec Vercel CLI

### Installation

```bash
npm install -g vercel
```

### Connexion

```bash
vercel login
```

### Déploiement

```bash
# Dans le dossier du projet
vercel

# Répondez aux questions :
# - Set up and deploy: Yes
# - Which scope: Votre compte
# - Link to existing project: No
# - Project name: domo (ou autre)
# - In which directory is your code: ./
# - Want to override settings: No

# Une fois déployé, configurez les variables d'environnement :
vercel env add TUYA_CLIENT_ID
# Entrez : ktuq7y5tgtw5433v8r4s

vercel env add TUYA_CLIENT_SECRET
# Entrez : 74c7023cc90946128ca8b6f887a4e5cb

vercel env add TUYA_REGION
# Entrez : eu

# Redéployer avec les variables :
vercel --prod
```

---

## 🎯 Méthode 3 : Import depuis le dossier (sans Git)

### Étape 1 : Préparer le projet

Créez une archive ZIP du projet :

```bash
# Exclure node_modules et .git
zip -r domo.zip . -x "node_modules/*" "*/node_modules/*" ".git/*"
```

### Étape 2 : Uploader sur Vercel

1. Allez sur [https://vercel.com/new](https://vercel.com/new)
2. Cliquez sur **Upload Files**
3. Glissez-déposez le fichier `domo.zip`
4. Suivez les mêmes étapes que la Méthode 1 (configuration + variables)

---

## ⚙️ Configuration avancée

### Fichier vercel.json (déjà inclus)

Le projet contient déjà un fichier `vercel.json` configuré :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build"
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

### APIs Serverless

Les APIs sont dans le dossier `/api` :

- `/api/health.js` - Health check
- `/api/userid.js` - Récupération auto du User ID
- `/api/devices.js` - Liste des appareils
- `/api/status.js` - Statut d'un appareil
- `/api/control.js` - Contrôle des appareils

---

## 🔧 Après le déploiement

### Vérifier que tout fonctionne

1. Ouvrez l'URL de votre application
2. L'app devrait charger automatiquement vos appareils
3. Testez d'allumer/éteindre un appareil

### Si ça ne marche pas

#### 1. Vérifier les variables d'environnement

Dans Vercel :
- Allez dans **Settings** → **Environment Variables**
- Vérifiez que les 3 variables sont présentes
- Si vous les modifiez, redéployez : **Deployments** → **⋮** → **Redeploy**

#### 2. Vérifier les logs

- Allez dans **Deployments** → Cliquez sur le dernier déploiement
- Cliquez sur **Functions** → Sélectionnez une API
- Consultez les logs pour voir les erreurs

#### 3. Problèmes courants

**"Impossible de récupérer les appareils"**
- Vérifiez les variables d'environnement
- Assurez-vous que TUYA_CLIENT_ID et TUYA_CLIENT_SECRET sont corrects

**"User ID non trouvé"**
- Vérifiez que vous avez bien lié votre compte Smart Life sur Tuya IoT Platform
- Vérifiez que vous avez des appareils dans Smart Life

**"502 Bad Gateway" ou "Function execution error"**
- Les functions Vercel ont un timeout de 10 secondes (plan gratuit)
- Si vous avez beaucoup d'appareils, cela peut prendre du temps
- Essayez de recharger la page après quelques secondes

---

## 🌐 Accès depuis n'importe où

Une fois déployé sur Vercel, votre application est accessible :

- ✅ Depuis n'importe quel navigateur
- ✅ Depuis n'importe quel téléphone/tablette
- ✅ Depuis n'importe quel réseau (WiFi, 4G, 5G)
- ✅ De n'importe où dans le monde

### Ajouter à l'écran d'accueil

**iPhone :**
1. Ouvrez l'URL dans Safari
2. Bouton Partager → "Sur l'écran d'accueil"
3. Nommez "Ma Domotique"

**Android :**
1. Ouvrez l'URL dans Chrome
2. Menu (⋮) → "Ajouter à l'écran d'accueil"
3. Nommez "Ma Domotique"

---

## 🎨 Personnalisation

### Domaine personnalisé (optionnel)

1. Dans Vercel, allez dans **Settings** → **Domains**
2. Cliquez sur **Add Domain**
3. Entrez votre domaine (ex: `domotique.votredomaine.com`)
4. Suivez les instructions pour configurer le DNS
5. Vercel configure automatiquement HTTPS

### Nom du projet

Pour changer le nom du projet (et donc l'URL) :
1. **Settings** → **General**
2. **Project Name** → Modifiez
3. L'URL devient : `https://nouveau-nom.vercel.app`

---

## 🔒 Sécurité

### Variables d'environnement

- ✅ Les variables sont sécurisées et chiffrées sur Vercel
- ✅ Elles ne sont jamais exposées au frontend
- ✅ Seules les serverless functions y ont accès

### HTTPS

- ✅ HTTPS automatique sur tous les déploiements Vercel
- ✅ Certificat SSL gratuit et renouvelé automatiquement

### Authentification (optionnel)

Si vous voulez protéger l'accès par mot de passe :

1. Ajoutez une variable d'environnement `AUTH_PASSWORD`
2. Modifiez les APIs pour vérifier un header d'authentification
3. Ou utilisez Vercel Password Protection (plan Pro)

---

## 📊 Monitoring

### Analytics (inclus gratuitement)

1. Dans Vercel, allez dans **Analytics**
2. Vous pouvez voir :
   - Nombre de visites
   - Performances
   - Pays des visiteurs

### Logs en temps réel

1. Allez dans **Deployments**
2. Cliquez sur le déploiement actif
3. **Functions** → Sélectionnez une API
4. Consultez les logs en temps réel

---

## 🔄 Mises à jour automatiques

### Avec GitHub (recommandé)

Si vous avez connecté GitHub :
1. Modifiez le code localement
2. Commit et push vers GitHub
3. Vercel détecte automatiquement et redéploie
4. En 2-3 minutes, les changements sont en ligne !

```bash
# Modifier le code
git add .
git commit -m "Amélioration de l'interface"
git push

# Vercel déploie automatiquement !
```

### Redéploiement manuel

1. **Deployments** → Sélectionnez un déploiement
2. **⋮** (trois points) → **Redeploy**

---

## 💰 Coûts

### Plan Gratuit (Hobby)

- ✅ **100 GB de bande passante/mois** (largement suffisant)
- ✅ **Illimité** déploiements
- ✅ **Illimité** projets
- ✅ **Illimité** serverless functions
- ✅ **HTTPS** automatique
- ✅ **CDN** mondial

**Pour une utilisation familiale, le plan gratuit est parfait !**

### Limites du plan gratuit

- 10 secondes de timeout par function
- 100 GB de bande passante/mois
- 100 heures d'exécution serverless/mois

Pour l'utilisation de cette app, vous n'atteindrez jamais ces limites.

---

## 🎓 Support et aide

### Documentation Vercel

- [Getting Started](https://vercel.com/docs)
- [Serverless Functions](https://vercel.com/docs/functions)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

### Problèmes ?

1. Consultez les logs Vercel
2. Vérifiez les variables d'environnement
3. Testez les APIs directement :
   - `https://votre-app.vercel.app/api/health`
   - `https://votre-app.vercel.app/api/userid`

---

## ✨ Récapitulatif

```
1. Connecter GitHub à Vercel
2. Importer le projet
3. Ajouter les 3 variables d'environnement
4. Déployer
5. Partager l'URL avec la famille
```

**C'est tout !** 🎉

Votre application de domotique est maintenant accessible 24/7 depuis n'importe où dans le monde !

---

🏠 **Profitez de votre domotique en ligne !**
