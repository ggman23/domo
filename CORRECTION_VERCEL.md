# 🔧 Correction du Déploiement Vercel

## Problème rencontré : 404 et déploiement trop rapide

Le déploiement a échoué à cause d'une mauvaise configuration. Voici comment corriger :

---

## 🚀 Solution : Supprimer et Redéployer

### Étape 1 : Supprimer le déploiement actuel

1. Allez sur [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Trouvez le projet **domo**
3. Cliquez sur le projet
4. Allez dans **Settings** (en haut à droite)
5. Tout en bas : **Delete Project**
6. Confirmez la suppression

---

### Étape 2 : Attendre la mise à jour Git

Le code a été corrigé. Attendez quelques secondes que GitHub synchronise.

---

### Étape 3 : Redéployer correctement

#### Option A : Via l'Interface Vercel (Recommandé)

1. Retournez sur [https://vercel.com/new](https://vercel.com/new)
2. Cliquez sur **Import Git Repository**
3. Trouvez **domo** dans la liste
4. Cliquez sur **Import**

#### Configuration Build Settings :

**Ne laissez PAS Vercel détecter automatiquement !**

Remplissez manuellement :

```
Framework Preset: Other
Build Command: npm run build
Output Directory: frontend/dist
Install Command: npm install
Root Directory: ./
```

#### Variables d'Environnement :

⚠️ **CRITIQUE : Ajoutez les 3 variables AVANT de déployer !**

Cliquez sur **Environment Variables** :

**Variable 1 :**
```
Name: TUYA_CLIENT_ID
Value: ktuq7y5tgtw5433v8r4s
```
✅ Cochez : Production, Preview, Development

**Variable 2 :**
```
Name: TUYA_CLIENT_SECRET
Value: 74c7023cc90946128ca8b6f887a4e5cb
```
✅ Cochez : Production, Preview, Development

**Variable 3 :**
```
Name: TUYA_REGION
Value: eu
```
✅ Cochez : Production, Preview, Development

#### Déployer :

Cliquez sur **Deploy** → Cette fois, ça devrait prendre **2-3 minutes** (pas 5 secondes !)

---

## ✅ Vérification

Une fois le déploiement terminé :

1. Ouvrez l'URL fournie
2. Vous devriez voir l'application charger
3. Elle devrait afficher vos appareils automatiquement

---

## 🐛 Si ça ne marche toujours pas

### Vérifier les logs de build :

1. Dans Vercel, allez dans **Deployments**
2. Cliquez sur le dernier déploiement
3. Regardez les **Build Logs**
4. Cherchez les erreurs en rouge

### Problèmes courants :

**"Cannot find module"**
→ Le build command n'est pas bon
→ Assurez-vous d'avoir bien mis : `npm run build`

**"404 Not Found"**
→ L'Output Directory n'est pas bon
→ Assurez-vous d'avoir bien mis : `frontend/dist`

**"Function invocation failed"**
→ Les variables d'environnement ne sont pas définies
→ Revérifiez qu'elles sont toutes les 3 présentes dans Settings → Environment Variables

---

## 📸 Captures d'écran de la configuration

### Build Settings doivent ressembler à :

```
┌─────────────────────────────────────────┐
│ Framework Preset: Other                 │
│ Build Command: npm run build            │
│ Output Directory: frontend/dist         │
│ Install Command: npm install            │
│ Root Directory: ./                      │
└─────────────────────────────────────────┘
```

### Environment Variables doivent montrer :

```
┌────────────────────────────────────────────────────┐
│ TUYA_CLIENT_ID        = ktuq7y5tg... [encrypted]  │
│ TUYA_CLIENT_SECRET    = 74c7023cc... [encrypted]  │
│ TUYA_REGION          = eu                         │
└────────────────────────────────────────────────────┘
```

---

## ⏱️ Durée normale du déploiement

- **Moins de 10 secondes** = ❌ Le build a échoué
- **2-3 minutes** = ✅ C'est normal !
- **Plus de 5 minutes** = ⚠️ Peut-être un problème réseau

---

## 🆘 Toujours pas de solution ?

Envoyez-moi :
1. Une capture d'écran des **Build Logs** (section rouge avec l'erreur)
2. Une capture d'écran de vos **Environment Variables**
3. Une capture d'écran de vos **Build Settings**

Je pourrai identifier le problème exact.

---

## 💡 Alternative : Déploiement via CLI

Si l'interface web ne fonctionne pas :

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Dans le dossier du projet
cd /home/user/domo

# Ajouter les variables d'environnement
vercel env add TUYA_CLIENT_ID production
# Entrer : ktuq7y5tgtw5433v8r4s

vercel env add TUYA_CLIENT_SECRET production
# Entrer : 74c7023cc90946128ca8b6f887a4e5cb

vercel env add TUYA_REGION production
# Entrer : eu

# Déployer
vercel --prod
```

---

🔧 **Le code a été corrigé, il suffit de redéployer !**
