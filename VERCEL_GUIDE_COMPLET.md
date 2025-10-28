# 🚀 Guide Pas à Pas : Déployer sur Vercel

## ✅ Prérequis
- Vous avez changé la branche par défaut sur GitHub ✓
- Vous avez vos identifiants Tuya (Client ID et Client Secret)

---

## 📍 ÉTAPE 1 : Se connecter à Vercel

1. **Ouvrez votre navigateur**

2. **Allez sur** : https://vercel.com

3. **Cliquez sur le bouton "Log in"** (en haut à droite)
   - Si vous n'avez pas de compte, cliquez sur "Sign Up" (c'est gratuit !)

4. **Choisissez "Continue with GitHub"**
   - C'est un gros bouton noir avec le logo GitHub

5. **GitHub va vous demander d'autoriser Vercel**
   - Cliquez sur **"Authorize Vercel"** (bouton vert)
   - GitHub peut vous demander votre mot de passe → entrez-le

6. **Vous arrivez sur le dashboard Vercel**
   - Vous voyez une page avec un bouton "Add New..." ou "Create a new project"

✅ Étape 1 terminée !

---

## 📍 ÉTAPE 2 : Importer votre projet

1. **Sur le dashboard Vercel, cliquez sur "Add New..."** (en haut à droite)

2. **Dans le menu qui s'ouvre, cliquez sur "Project"**

3. **Vercel va vous montrer une liste de vos repositories GitHub**
   - Vous devriez voir **"domo"** dans la liste
   - Si vous ne le voyez pas :
     - Cliquez sur "Adjust GitHub App Permissions"
     - Autorisez Vercel à accéder à tous vos repositories
     - Revenez en arrière

4. **Trouvez "domo" dans la liste et cliquez sur "Import"**
   - C'est un bouton bleu à côté du nom "domo"

✅ Étape 2 terminée ! Vous êtes maintenant sur la page de configuration.

---

## 📍 ÉTAPE 3 : Configurer le projet

Vous êtes maintenant sur une page qui dit **"Configure Project"**.

### 3.1 - Vérifier le nom du projet

1. **Tout en haut**, vous voyez :
   ```
   Project Name: domo
   ```
   - C'est bon, ne touchez à rien

### 3.2 - Vérifier le Framework

2. **Descendez un peu**, vous voyez :
   ```
   Framework Preset: Vite
   ```
   - Si c'est marqué "Vite" → Parfait, ne touchez à rien !
   - Si ce n'est pas détecté → Pas grave, continuez

### 3.3 - Vérifier la branche

3. **Vous devriez voir** :
   ```
   Branch: claude/fix-vercel-deployment-011CUaPj2PAR8dbMoZU1Q7BL
   ```
   - Ou peut-être `main` si vous avez créé la branche main
   - C'est bon dans tous les cas !

### 3.4 - Root Directory

4. **Vous voyez** :
   ```
   Root Directory: ./
   ```
   - Ne touchez à RIEN, laissez `./`

✅ Étape 3 terminée ! Maintenant l'étape la plus importante...

---

## 📍 ÉTAPE 4 : Ajouter les variables d'environnement ⚠️ CRUCIAL

Cette étape est **INDISPENSABLE** pour que votre app fonctionne !

### 4.1 - Ouvrir la section

1. **Descendez sur la page jusqu'à voir** :
   ```
   Environment Variables
   ```

2. **Cliquez dessus pour déplier** (si ce n'est pas déjà ouvert)
   - Vous verrez des champs pour ajouter des variables

### 4.2 - Ajouter la première variable : TUYA_CLIENT_ID

1. **Dans le champ "NAME"** (ou "Key"), tapez exactement :
   ```
   TUYA_CLIENT_ID
   ```
   ⚠️ Respectez bien les majuscules/minuscules !

2. **Dans le champ "VALUE"**, collez votre Client ID Tuya
   - Exemple : `ktuq7y5tgtw5433v8r4s` (mais utilisez le VOTRE)

3. **Cochez les 3 cases** :
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Cliquez sur "Add"** (ou appuyez sur Entrée)

### 4.3 - Ajouter la deuxième variable : TUYA_CLIENT_SECRET

1. **Dans le champ "NAME"**, tapez :
   ```
   TUYA_CLIENT_SECRET
   ```

2. **Dans le champ "VALUE"**, collez votre Client Secret Tuya
   - Exemple : `74c7023cc90946128ca8b6f887a4e5cb` (mais utilisez le VOTRE)

3. **Cochez les 3 cases** :
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Cliquez sur "Add"**

### 4.4 - Ajouter la troisième variable : TUYA_REGION

1. **Dans le champ "NAME"**, tapez :
   ```
   TUYA_REGION
   ```

2. **Dans le champ "VALUE"**, tapez :
   ```
   eu
   ```

3. **Cochez les 3 cases** :
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Cliquez sur "Add"**

### 4.5 - Vérifier

**Vous devriez maintenant voir 3 variables listées** :
```
✓ TUYA_CLIENT_ID
✓ TUYA_CLIENT_SECRET
✓ TUYA_REGION
```

✅ Étape 4 terminée ! Bravo, c'était la partie la plus importante !

---

## 📍 ÉTAPE 5 : Déployer ! 🎉

1. **Tout en bas de la page**, vous voyez un gros bouton bleu :
   ```
   Deploy
   ```

2. **Cliquez dessus !**

3. **Vercel va commencer le déploiement**
   - Vous verrez une page avec des logs qui défilent
   - Des petites icônes qui tournent
   - Ça dit "Building" puis "Deploying"

4. **Attendez 2-3 minutes**
   - Vercel compile votre application
   - Installe les dépendances
   - Crée les API serverless
   - Déploie sur le CDN mondial

5. **Quand c'est terminé, vous voyez** :
   ```
   🎉 Congratulations!
   ```
   - Avec une image de confettis
   - Et un lien vers votre application !

✅ Étape 5 terminée ! VOTRE APP EST EN LIGNE ! 🚀

---

## 📍 ÉTAPE 6 : Tester votre application

1. **Cliquez sur "Visit"** ou sur le lien affiché
   - L'URL ressemble à : `https://domo-xxxx.vercel.app`

2. **Votre application s'ouvre dans un nouvel onglet**

3. **Attendez quelques secondes**
   - L'app va automatiquement :
     - Récupérer votre User ID Tuya
     - Charger vos appareils Smart Life
     - Afficher votre tableau de bord

4. **Testez d'allumer/éteindre un appareil**
   - Cliquez sur le bouton d'un de vos appareils
   - Il devrait s'allumer ou s'éteindre !

✅ Étape 6 terminée ! Tout fonctionne !

---

## 📱 ÉTAPE 7 : Partager avec la famille

1. **Copiez l'URL de votre application**
   - Exemple : `https://domo-abc123.vercel.app`

2. **Partagez-la avec votre famille**
   - Par SMS, WhatsApp, email...

3. **Ils peuvent l'ouvrir sur n'importe quel appareil** :
   - ✅ Téléphone (iPhone, Android)
   - ✅ Tablette
   - ✅ Ordinateur
   - ✅ Depuis n'importe où dans le monde !

### Bonus : Ajouter à l'écran d'accueil

**Sur iPhone :**
1. Ouvrir l'URL dans Safari
2. Bouton Partager (carré avec flèche) → "Sur l'écran d'accueil"
3. Nommer "Ma Domotique" → Ajouter

**Sur Android :**
1. Ouvrir l'URL dans Chrome
2. Menu (⋮) → "Ajouter à l'écran d'accueil"
3. Nommer "Ma Domotique" → Ajouter

✅ Comme une vraie application !

---

## 🎨 BONUS : Personnaliser l'URL (optionnel)

Si vous voulez une URL plus jolie :

1. **Retournez sur Vercel Dashboard**

2. **Cliquez sur votre projet "domo"**

3. **Allez dans Settings → Domains**

4. **Vous pouvez** :
   - Changer le sous-domaine : `mon-nom.vercel.app`
   - Ou ajouter votre propre domaine : `domotique.monsite.com`

---

## ❓ Si quelque chose ne marche pas

### L'app affiche "Impossible de récupérer les appareils"

**Testez vos APIs :**

1. Ouvrez un nouvel onglet
2. Allez sur : `https://VOTRE-URL.vercel.app/api/health`
3. Vous devriez voir : `{"status":"OK",...}`

Si ça ne marche pas :
- Vérifiez les variables d'environnement (Étape 4)
- Allez dans Settings → Environment Variables
- Vérifiez qu'elles sont bien là

### Page blanche

1. Ouvrez la console (F12)
2. Regardez les erreurs
3. Contactez-moi avec le message d'erreur

### Besoin de voir les logs

1. **Sur Vercel Dashboard** → Cliquez sur votre projet
2. **Deployments** → Cliquez sur le dernier déploiement
3. **Functions** → Sélectionnez une API
4. **Vous verrez les logs en temps réel**

---

## 🎯 Récapitulatif

```
✓ Se connecter à Vercel avec GitHub
✓ Importer le projet "domo"
✓ Ajouter les 3 variables d'environnement
✓ Cliquer sur Deploy
✓ Attendre 2-3 minutes
✓ Tester l'application
✓ Partager l'URL !
```

---

## 🎉 Félicitations !

Votre application de domotique est maintenant :
- ✅ En ligne 24/7
- ✅ Accessible de partout dans le monde
- ✅ Avec HTTPS automatique
- ✅ Sur un CDN ultra-rapide
- ✅ Gratuit !

**Profitez bien de votre domotique en ligne !** 🏠✨

---

💡 **Astuce** : Si vous modifiez le code plus tard, il suffit de faire `git push` et Vercel redéploiera automatiquement ! Magique ! ✨
