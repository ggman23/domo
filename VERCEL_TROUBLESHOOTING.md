# 🔧 Dépannage Vercel - Solutions Rapides

## ❌ Problèmes courants et solutions

### 1. "Build Failed" lors du déploiement

**Symptômes :** Le déploiement échoue avec une erreur de build

**Solutions :**
```bash
# Vérifiez que le vercel.json est correct
cat vercel.json

# Devrait contenir :
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "npm install --prefix ./api"
}
```

**Actions :**
1. Assurez-vous que le `vercel.json` est à la racine du projet
2. Vérifiez que le dossier `frontend` existe
3. Vérifiez que `frontend/package.json` a le script `build`

---

### 2. "500 Internal Server Error" sur les APIs

**Symptômes :** Les appels à `/api/devices` ou autres retournent 500

**Cause probable :** Variables d'environnement manquantes

**Solution :**
1. Allez dans Vercel Dashboard → **Settings** → **Environment Variables**
2. Vérifiez que ces 3 variables existent :
   - `TUYA_CLIENT_ID`
   - `TUYA_CLIENT_SECRET`
   - `TUYA_REGION`
3. Si elles sont absentes, ajoutez-les
4. **Redéployez** : Deployments → ⋮ → Redeploy

---

### 3. "Module not found: crypto"

**Symptômes :** Erreur dans les logs Vercel mentionnant `crypto`

**Solution :**
Le module `crypto` est natif à Node.js. Vérifiez que `api/package.json` ne contient PAS `"crypto"` dans les dépendances :

```json
{
  "name": "domo-api",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "axios": "^1.6.2"
  }
}
```

Si `crypto` apparaît, supprimez-le et redéployez.

---

### 4. "404 Not Found" sur les pages

**Symptômes :** La page d'accueil fonctionne mais les routes retournent 404

**Solution :**
C'est normal si vous rafraîchissez une route directement. Vercel sert le frontend comme une SPA (Single Page Application).

**Actions :**
1. Ajoutez un fichier `frontend/public/_redirects` ou `vercel.json` avec des règles de redirection
2. Pour cette app, ce n'est pas nécessaire car tout est sur la page d'accueil

---

### 5. "CORS Error" dans la console du navigateur

**Symptômes :**
```
Access to fetch at 'https://votre-app.vercel.app/api/devices' from origin 'https://votre-app.vercel.app' has been blocked by CORS policy
```

**Solution :**
Tous les fichiers API ont déjà les headers CORS configurés. Si le problème persiste :

1. Vérifiez que les fichiers dans `/api` contiennent bien :
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
```

2. Assurez-vous que la requête OPTIONS est gérée :
```javascript
if (req.method === 'OPTIONS') {
  res.status(200).end();
  return;
}
```

---

### 6. "Function execution timeout"

**Symptômes :** Erreur 504 ou "Function execution timed out after 10.00 seconds"

**Cause :** Les APIs Tuya prennent trop de temps à répondre

**Solutions :**
1. **Court terme :** Réessayez la requête
2. **Moyen terme :** Vérifiez que votre API Tuya fonctionne correctement
3. **Long terme :** Upgrader vers Vercel Pro (timeout de 60s)

**Pour le plan gratuit :**
- Timeout max : 10 secondes
- Largement suffisant pour cette app

---

### 7. Variables d'environnement non détectées

**Symptômes :** L'app ne trouve pas `process.env.TUYA_CLIENT_ID`

**Solution :**

1. Les variables doivent être ajoutées dans Vercel Dashboard, PAS dans un fichier `.env`
2. Format exact :
   - Nom : `TUYA_CLIENT_ID` (pas de guillemets)
   - Valeur : `votre_client_id` (pas de guillemets)
3. Cochez **Production**, **Preview** et **Development**
4. Redéployez après ajout

---

### 8. "Impossible de récupérer les appareils"

**Symptômes :** L'app affiche "Aucun appareil trouvé"

**Diagnostic :**

1. Testez l'API health : `https://votre-app.vercel.app/api/health`
   - Devrait retourner : `{"status":"OK","message":"API Domotique en ligne"}`

2. Testez l'API userid : `https://votre-app.vercel.app/api/userid`
   - Si erreur : Vérifiez les variables d'environnement
   - Si succès : Notez le `userId`

3. Testez l'API devices : `https://votre-app.vercel.app/api/devices?userId=VOTRE_USER_ID`
   - Si erreur : Problème avec l'API Tuya
   - Si succès : Problème dans le frontend

**Actions selon le résultat :**
- **Health fail** → Problème de déploiement Vercel
- **UserID fail** → Problème de credentials Tuya
- **Devices fail** → Problème de permissions Tuya ou User ID incorrect
- **Frontend fail** → Erreur dans le code React (voir console)

---

### 9. Build réussit mais page blanche

**Symptômes :** Le déploiement réussit mais la page est blanche

**Solution :**

1. Ouvrez la console du navigateur (F12)
2. Regardez les erreurs

**Erreurs courantes :**
- `Failed to load module` → Problème de chemin dans vite.config.js
- `Cannot read property of undefined` → Erreur dans App.jsx

**Fix :**
Vérifiez que `vite.config.js` contient :
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

**Note :** Le proxy n'est utilisé qu'en développement local. Sur Vercel, `/api` pointe directement vers les serverless functions.

---

### 10. "API resolved without sending a response"

**Symptômes :** Warning dans les logs Vercel

**Cause :** Une function API ne retourne pas de réponse dans tous les cas

**Solution :**
Vérifiez que chaque fichier dans `/api` :
- Retourne toujours un `res.status().json()` ou `res.status().end()`
- N'a pas de chemin de code sans `return`

**Exemple correct :**
```javascript
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await fetchData();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
```

---

## 🔍 Commandes de diagnostic

### Tester les APIs en local

```bash
# Démarrer le backend en local
cd backend
npm install
npm run dev

# Dans un autre terminal, tester
curl http://localhost:3001/api/health
```

### Tester les APIs sur Vercel

```bash
# Health check
curl https://votre-app.vercel.app/api/health

# User ID
curl https://votre-app.vercel.app/api/userid

# Devices (remplacez USER_ID)
curl "https://votre-app.vercel.app/api/devices?userId=USER_ID"
```

---

## 📊 Vérifier les logs

### Via Vercel Dashboard

1. **Deployments** → Cliquez sur le dernier déploiement
2. **Functions** → Sélectionnez une API (ex: `api/devices`)
3. **Realtime Logs** → Voir les erreurs en temps réel

### Via Vercel CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Login
vercel login

# Voir les logs
vercel logs
```

---

## ✅ Checklist de vérification complète

Avant de demander de l'aide, vérifiez :

- [ ] Le `vercel.json` est correct et à la racine
- [ ] Les 3 variables d'environnement sont présentes dans Vercel
- [ ] Le build réussit sans erreur
- [ ] L'API `/api/health` retourne 200
- [ ] L'API `/api/userid` retourne un User ID
- [ ] Les credentials Tuya sont corrects
- [ ] Le dossier `/api` contient bien les 5 fichiers JS
- [ ] Le `api/package.json` a `"type": "module"`
- [ ] Le `frontend/package.json` a le script `"build"`
- [ ] Pas de fichier `.env` committé (utiliser variables Vercel)

---

## 🆘 Obtenir de l'aide

### Logs Vercel
Les logs sont votre meilleur ami. Consultez-les TOUJOURS en premier.

### Support Vercel
- Documentation : https://vercel.com/docs
- Community : https://github.com/vercel/vercel/discussions

### Tuya API
- Console : https://iot.tuya.com
- Docs : https://developer.tuya.com

---

## 🚀 Redéploiement rapide

Si tout échoue, redéployez from scratch :

```bash
# Via Vercel Dashboard
1. Settings → General → Delete Project
2. Suivez à nouveau le guide DEPLOIEMENT_VERCEL.md

# Via Vercel CLI
vercel --prod --force
```

---

Bon déploiement ! 🎉
