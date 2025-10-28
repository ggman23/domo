# 🚂 Guide de Déploiement Railway (Ultra Simple)

Railway est **beaucoup plus simple** que Vercel pour ce type d'application. Votre app fonctionne comme un vrai serveur !

---

## ⏱️ Temps nécessaire : 5 minutes

---

## 📍 ÉTAPE 1 : Créer un compte Railway

1. Allez sur **https://railway.app**
2. Cliquez sur **"Login"** ou **"Start a New Project"**
3. Choisissez **"Login with GitHub"** (bouton noir avec logo GitHub)
4. Autorisez Railway à accéder à vos repositories
5. Vous arrivez sur le dashboard Railway ✅

---

## 📍 ÉTAPE 2 : Créer un nouveau projet

1. Sur le dashboard, cliquez sur **"New Project"** (gros bouton violet)
2. Choisissez **"Deploy from GitHub repo"**
3. Dans la liste, trouvez et cliquez sur **"domo"**
4. Railway commence automatiquement le déploiement !

### Railway détecte automatiquement :
- ✅ Node.js
- ✅ Les scripts de build
- ✅ Comment démarrer l'app

---

## 📍 ÉTAPE 3 : Ajouter les variables d'environnement ⚠️ IMPORTANT

**Pendant que ça déploie** (ou après), ajoutez les variables :

1. **Cliquez sur votre service** (il s'appelle probablement "domo")
2. **Allez dans l'onglet "Variables"**
3. **Cliquez sur "New Variable"**

### Ajoutez ces 3 variables :

#### Variable 1 :
- **Variable Name** : `TUYA_CLIENT_ID`
- **Value** : Votre Client ID Tuya
- Cliquez **"Add"**

#### Variable 2 :
- **Variable Name** : `TUYA_CLIENT_SECRET`
- **Value** : Votre Client Secret Tuya
- Cliquez **"Add"**

#### Variable 3 :
- **Variable Name** : `TUYA_REGION`
- **Value** : `eu`
- Cliquez **"Add"**

**Vous devriez voir 3 variables** ✅

---

## 📍 ÉTAPE 4 : Redémarrer le déploiement

1. **Cliquez sur l'onglet "Deployments"**
2. **Cliquez sur les 3 points (⋮)** du dernier déploiement
3. **Cliquez sur "Redeploy"**

Ou simplement :
1. Allez dans **Settings** (en bas à gauche)
2. Descendez et cliquez sur **"Restart"**

Railway va redéployer avec les variables d'environnement ! ⏳

---

## 📍 ÉTAPE 5 : Obtenir l'URL publique

1. **Retournez sur l'onglet "Settings"**
2. **Descendez jusqu'à "Networking"**
3. **Cliquez sur "Generate Domain"**

Railway va générer une URL publique comme :
```
https://domo-production-xxxx.up.railway.app
```

✅ **Votre application est en ligne !**

---

## 📍 ÉTAPE 6 : Tester

1. **Cliquez sur l'URL générée** (ou ouvrez-la dans un nouvel onglet)
2. **Attendez quelques secondes** que l'app charge vos appareils
3. **Testez d'allumer/éteindre** un appareil

### Test de diagnostic :
Ouvrez aussi : `https://VOTRE-URL/api/debug`

Vous devriez voir :
```json
{
  "success": true,
  "environment": {
    "TUYA_CLIENT_ID": "ktuq7...",
    "TUYA_CLIENT_SECRET": "✓ Défini (caché)",
    "TUYA_REGION": "eu"
  }
}
```

✅ **Tout fonctionne !** 🎉

---

## 📍 ÉTAPE 7 : Partager avec la famille

1. **Copiez l'URL** : `https://domo-production-xxxx.up.railway.app`
2. **Envoyez-la à votre famille** par SMS, WhatsApp, email...
3. **Ils peuvent l'ouvrir sur n'importe quel appareil !**

### Ajouter à l'écran d'accueil (comme une app)

**iPhone :**
1. Safari → Bouton Partager → "Sur l'écran d'accueil"
2. Nommer "Ma Domotique"

**Android :**
1. Chrome → Menu (⋮) → "Ajouter à l'écran d'accueil"
2. Nommer "Ma Domotique"

---

## 🎯 Récapitulatif Ultra-Rapide

```
1. railway.app → Login with GitHub
2. New Project → Deploy from GitHub → domo
3. Variables → Ajouter 3 variables d'environnement
4. Redeploy
5. Settings → Generate Domain
6. Tester l'URL
7. Partager !
```

---

## 🎨 Personnaliser l'URL (optionnel)

Si vous voulez une URL plus courte :

1. **Settings** → **Networking**
2. Vous pouvez ajouter un **Custom Domain** (votre propre domaine)
3. Ou utiliser l'URL Railway générée

---

## 💰 Coûts

### Plan Gratuit (Hobby)
- ✅ **500 heures d'exécution/mois** (largement suffisant)
- ✅ **$5 de crédit gratuit/mois** (environ 500h de serveur)
- ✅ Déploiements illimités
- ✅ Variables d'environnement illimitées
- ✅ HTTPS automatique

**Pour une utilisation familiale, le plan gratuit est parfait !**

Vous ne paierez rien tant que vous ne dépassez pas les 500 heures/mois.

---

## 🔄 Mises à jour automatiques

### Avec GitHub (automatique !)

1. **Modifiez le code localement**
2. **Commit et push** vers GitHub :
   ```bash
   git add .
   git commit -m "Amélioration"
   git push
   ```
3. **Railway détecte et redéploie automatiquement !** ✨

En 2-3 minutes, vos changements sont en ligne !

---

## 🔍 Voir les logs

Si quelque chose ne marche pas :

1. **Cliquez sur votre service**
2. **Onglet "Deployments"**
3. **Cliquez sur le dernier déploiement**
4. **Vous voyez les logs en temps réel** 📊

Ou :

1. **Onglet "Logs"** (en haut)
2. **Logs en temps réel de votre application**

---

## ❓ Problèmes ?

### "Application Error" ou "Service Unavailable"

1. **Vérifiez les logs** (onglet Deployments ou Logs)
2. **Vérifiez les variables** (onglet Variables)
3. Si vous voyez une erreur, redémarrez : Settings → Restart

### "Impossible de récupérer les appareils"

1. Testez `/api/debug` pour vérifier les variables
2. Vérifiez vos credentials Tuya sur https://iot.tuya.com
3. Redéployez après avoir ajouté/modifié les variables

### Le déploiement échoue

1. Regardez les logs du déploiement
2. Vérifiez que le build frontend a réussi
3. Railway supporte automatiquement Node.js, pas besoin de config !

---

## 🆘 Support

### Railway Documentation
- https://docs.railway.app
- Très bien faite et simple !

### Community
- Discord Railway : https://discord.gg/railway
- Très réactif !

---

## ✅ Avantages de Railway vs Vercel

- ✅ **Plus simple** : Tout fonctionne comme un serveur normal
- ✅ **Moins de bugs** : Pas de problème de variables d'environnement
- ✅ **Logs en temps réel** : Plus facile à debugger
- ✅ **Déploiement automatique** depuis GitHub
- ✅ **Gratuit** pour usage personnel

---

## 🎉 C'est parti !

**Railway est vraiment plus simple que Vercel pour ce type d'app.**

Vous n'aurez plus le problème "sign invalid" ! 🚀

---

💡 **Astuce** : Gardez l'onglet Railway ouvert pendant le premier déploiement pour voir les logs. C'est rassurant de voir que tout se passe bien !

**Bonne chance ! 😊**
