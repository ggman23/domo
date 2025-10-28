# Guide d'Accès Internet

Ce guide vous explique comment rendre votre application de domotique accessible depuis n'importe où dans le monde via Internet.

## Table des matières

1. [Accès Local vs Réseau vs Internet](#accès-local-vs-réseau-vs-internet)
2. [Solution 1: Cloudflare Tunnel (Recommandé)](#solution-1-cloudflare-tunnel-recommandé)
3. [Solution 2: ngrok](#solution-2-ngrok)
4. [Solution 3: Hébergement Cloud](#solution-3-hébergement-cloud)

---

## Accès Local vs Réseau vs Internet

### 🏠 Accès LOCAL
- **Disponible** : Seulement sur l'ordinateur où tourne l'application
- **URL** : `http://localhost:3000`
- **Utilisation** : Tests et développement

### 📱 Accès RÉSEAU LOCAL
- **Disponible** : Tous les appareils sur le même WiFi (téléphones, tablettes, etc.)
- **URL** : `http://192.168.X.X:3000` (adresse affichée au démarrage)
- **Utilisation** : Accès familial à la maison
- **Configuration** : Déjà activé ! Aucune action requise.

### 🌐 Accès INTERNET
- **Disponible** : N'importe où dans le monde (4G, autres WiFi, etc.)
- **URL** : URL publique fournie par le tunnel ou l'hébergeur
- **Utilisation** : Contrôle de la maison depuis l'extérieur
- **Configuration** : Suivez l'un des guides ci-dessous

---

## Solution 1: Cloudflare Tunnel (Recommandé)

✅ **Gratuit**
✅ **Sécurisé (HTTPS automatique)**
✅ **Aucune configuration réseau**
✅ **Pas besoin d'ouvrir de ports**

### Installation rapide

#### Sur Linux/Mac :

```bash
# Le script installe cloudflared automatiquement si nécessaire
npm run tunnel
```

#### Sur Windows :

1. Téléchargez Cloudflared : https://github.com/cloudflare/cloudflared/releases/latest
2. Installez le fichier `.msi` ou `.exe`
3. Ouvrez PowerShell ou CMD et lancez :
   ```bash
   npm run tunnel
   ```

### Utilisation

1. Lancez d'abord l'application normalement :
   ```bash
   npm run dev
   ```

2. Dans un **NOUVEAU terminal**, lancez le tunnel :
   ```bash
   npm run tunnel
   ```

3. Vous verrez apparaître une URL publique :
   ```
   Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):
   https://random-word-1234.trycloudflare.com
   ```

4. **Partagez cette URL** avec votre famille !

### Points importants

- L'URL change à chaque lancement (gratuit)
- Le tunnel doit rester actif (laissez le terminal ouvert)
- Connexion HTTPS sécurisée automatique
- Aucune limite de bande passante

### Pour une URL permanente (optionnel)

Si vous voulez toujours la même URL :

1. Créez un compte gratuit Cloudflare
2. Configurez un tunnel permanent :
   ```bash
   cloudflared tunnel login
   cloudflared tunnel create mon-domicile
   cloudflared tunnel route dns mon-domicile domotique.votredomaine.com
   ```

---

## Solution 2: ngrok

Alternative à Cloudflare, tout aussi simple.

### Installation

1. Créez un compte gratuit : https://ngrok.com/
2. Installez ngrok :
   - **Windows** : Téléchargez depuis le site
   - **Linux** :
     ```bash
     curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
     echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
     sudo apt update && sudo apt install ngrok
     ```
   - **Mac** :
     ```bash
     brew install ngrok/ngrok/ngrok
     ```

3. Connectez votre compte :
   ```bash
   ngrok config add-authtoken VOTRE_TOKEN
   ```

### Utilisation

1. Lancez l'application :
   ```bash
   npm run dev
   ```

2. Dans un nouveau terminal :
   ```bash
   ngrok http 3000
   ```

3. Utilisez l'URL fournie (exemple: `https://abc123.ngrok.io`)

### Limites du plan gratuit

- URL change à chaque lancement
- Limite de 40 connexions/minute
- Écran d'avertissement ngrok avant d'accéder au site

---

## Solution 3: Hébergement Cloud

Pour une solution permanente et professionnelle.

### Option A: Heroku (le plus simple)

1. Créez un compte gratuit : https://heroku.com
2. Installez Heroku CLI
3. Créez un fichier `Procfile` :
   ```
   web: npm start
   release: cd backend && node -e "console.log('Backend ready')"
   ```
4. Déployez :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   heroku create mon-app-domotique
   git push heroku main
   ```

### Option B: Vercel (pour le frontend)

1. Compte gratuit : https://vercel.com
2. Installez Vercel CLI :
   ```bash
   npm install -g vercel
   ```
3. Dans le dossier frontend :
   ```bash
   vercel deploy --prod
   ```

### Option C: VPS (serveur dédié)

Pour avoir un contrôle total :

- **DigitalOcean** : À partir de 5$/mois
- **OVH** : À partir de 3.50€/mois
- **Contabo** : À partir de 4€/mois

Installez Node.js, clonez votre projet, et lancez-le avec PM2 :
```bash
npm install -g pm2
pm2 start "npm run dev" --name domotique
pm2 save
pm2 startup
```

---

## Comparaison des solutions

| Solution | Prix | Facilité | Permanent | HTTPS | Recommandation |
|----------|------|----------|-----------|-------|----------------|
| **Cloudflare Tunnel** | Gratuit | ⭐⭐⭐⭐⭐ | Non* | Oui | **Meilleur choix** |
| **ngrok** | Gratuit | ⭐⭐⭐⭐ | Non* | Oui | Alternative viable |
| **Heroku** | Gratuit | ⭐⭐⭐ | Oui | Oui | Pour production |
| **Vercel** | Gratuit | ⭐⭐⭐⭐ | Oui | Oui | Frontend seulement |
| **VPS** | 4-5€/mois | ⭐⭐ | Oui | Oui** | Contrôle total |

*Peut être permanent avec configuration avancée
**Nécessite configuration (Let's Encrypt)

---

## Sécurité

### Bonnes pratiques

1. **Utilisez HTTPS** : Toutes les solutions ci-dessus le fournissent
2. **Mot de passe** : Ajoutez une authentification à l'app (voir section suivante)
3. **Mise à jour** : Gardez Node.js et les packages à jour
4. **Pare-feu** : Si hébergement VPS, configurez un pare-feu
5. **Logs** : Surveillez les connexions suspectes

### Ajouter une authentification (optionnel)

Pour protéger l'accès à votre application :

```javascript
// Dans backend/server.js, ajoutez avant les routes :

const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Domotique"');
    return res.status(401).send('Authentification requise');
  }

  const [type, credentials] = auth.split(' ');
  const [username, password] = Buffer.from(credentials, 'base64').toString().split(':');

  // Changez ces valeurs !
  if (username === 'famille' && password === 'motdepasse123') {
    next();
  } else {
    res.status(401).send('Identifiants incorrects');
  }
};

// Appliquez à toutes les routes
app.use('/api', basicAuth);
```

---

## FAQ

### Le tunnel se déconnecte souvent

- Utilisez `pm2` pour relancer automatiquement :
  ```bash
  npm install -g pm2
  pm2 start "npm run tunnel" --name tunnel
  pm2 save
  ```

### L'URL est trop longue / difficile à retenir

- Utilisez un raccourcisseur d'URL (bit.ly, tinyurl.com)
- Ou configurez un tunnel permanent avec votre propre domaine

### Ma famille ne peut pas accéder

Vérifiez que :
1. Le serveur tourne (`npm run dev`)
2. Le tunnel est actif (`npm run tunnel` dans un autre terminal)
3. Vous partagez la bonne URL (celle affichée par le tunnel, pas localhost)
4. Ils utilisent HTTPS et non HTTP

### Les performances sont lentes

- Le tunnel gratuit peut être plus lent
- Considérez un hébergement cloud pour de meilleures performances
- Vérifiez votre connexion internet

---

## Besoin d'aide ?

1. Vérifiez que l'app fonctionne localement d'abord
2. Testez sur le réseau local avant d'utiliser un tunnel
3. Consultez les logs du serveur pour les erreurs
4. Assurez-vous que le pare-feu ne bloque pas les connexions

---

🎉 **Profitez de votre domotique accessible partout !**
