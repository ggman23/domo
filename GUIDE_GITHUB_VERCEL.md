# 📖 Guide Simple : Définir la branche corrigée comme branche principale

## Option la plus simple : Changer la branche par défaut sur GitHub

### Étape 1 : Aller sur votre repository GitHub

1. Ouvrez votre navigateur
2. Allez sur **https://github.com/ggman23/domo**
3. Connectez-vous à votre compte GitHub si nécessaire

### Étape 2 : Aller dans les paramètres

1. Sur la page de votre repository, cherchez en haut à droite
2. Cliquez sur **"Settings"** (Paramètres) - c'est l'icône ⚙️

### Étape 3 : Changer la branche par défaut

1. Dans le menu de gauche, vous êtes déjà sur **"General"**
2. Descendez jusqu'à la section **"Default branch"** (Branche par défaut)
3. Vous verrez un bouton avec une flèche ⇄ et le nom de la branche actuelle
4. Cliquez sur la flèche ⇄ (ou le bouton "Switch")
5. Dans le menu déroulant, sélectionnez : **`claude/fix-vercel-deployment-011CUaPj2PAR8dbMoZU1Q7BL`**
6. Cliquez sur **"Update"** ou **"I understand, update the default branch"**

### Étape 4 : Confirmer

GitHub va vous demander de confirmer. Cliquez sur **"I understand, update the default branch"**

✅ **C'est fait !** Maintenant, quand Vercel importera votre projet, il utilisera automatiquement cette branche avec toutes mes corrections !

---

## Si vous préférez créer une branche "main"

### Alternative : Créer une branche "main" depuis l'interface GitHub

1. Allez sur **https://github.com/ggman23/domo**
2. Cliquez sur le menu déroulant des branches (en haut à gauche, il affiche le nom de la branche actuelle)
3. Dans le champ de texte, tapez : **`main`**
4. Cliquez sur **"Create branch: main from 'claude/fix-vercel-deployment-011CUaPj2PAR8dbMoZU1Q7BL'"**

✅ Voilà ! Vous avez maintenant une branche "main" avec toutes mes corrections !

---

## Maintenant, déployer sur Vercel

Une fois que vous avez fait l'une des deux options ci-dessus :

### Étape 1 : Connecter Vercel à GitHub

1. Allez sur **https://vercel.com**
2. Cliquez sur **"Log in"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à vos repositories

### Étape 2 : Importer le projet

1. Sur le dashboard Vercel, cliquez sur **"Add New..."** → **"Project"**
2. Trouvez **"domo"** dans la liste de vos repositories
3. Cliquez sur **"Import"**

### Étape 3 : Vérifier la branche

Vercel va automatiquement détecter la branche par défaut. Vous devriez voir :
- **Branch:** `main` (si vous avez créé la branche main)
- ou **Branch:** `claude/fix-vercel-deployment-011CUaPj2PAR8dbMoZU1Q7BL` (si vous avez changé la branche par défaut)

### Étape 4 : Ajouter les variables d'environnement ⚠️ IMPORTANT

Dépliez la section **"Environment Variables"** et ajoutez :

**Variable 1:**
- Name: `TUYA_CLIENT_ID`
- Value: Votre client ID Tuya

**Variable 2:**
- Name: `TUYA_CLIENT_SECRET`
- Value: Votre client secret Tuya

**Variable 3:**
- Name: `TUYA_REGION`
- Value: `eu`

Pour chaque variable, cochez : **Production**, **Preview**, **Development**

### Étape 5 : Déployer !

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes que Vercel compile et déploie
3. 🎉 Votre application est en ligne !

Vercel vous donnera une URL du type : `https://domo-xxxx.vercel.app`

---

## 📸 Captures d'écran textuelles

### Sur GitHub (Settings) :
```
┌─────────────────────────────────────────┐
│ ⚙️ Settings                              │
├─────────────────────────────────────────┤
│                                         │
│ Default branch                          │
│ ┌─────────────────────────────────┐    │
│ │ claude/fix-vercel... ⇄          │◄─── Cliquez ici
│ └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

### Sur Vercel (Import) :
```
┌─────────────────────────────────────────┐
│ Configure Project                        │
├─────────────────────────────────────────┤
│                                         │
│ Environment Variables                   │
│ ┌───────────────────────────────────┐  │
│ │ NAME              VALUE            │  │
│ │ TUYA_CLIENT_ID    [votre_id]     │  │◄── Ajoutez ici
│ │ TUYA_CLIENT_SECRET [votre_secret]│  │
│ │ TUYA_REGION       eu              │  │
│ └───────────────────────────────────┘  │
│                                         │
│          [Deploy] ◄─── Cliquez ici     │
└─────────────────────────────────────────┘
```

---

## ❓ Si vous êtes bloqué

**Où trouver vos identifiants Tuya ?**
- Allez sur https://iot.tuya.com
- Connectez-vous
- Cloud → Development → Votre projet
- Vous verrez "Client ID" et "Client Secret"

**La branche n'apparaît pas sur GitHub ?**
- Rafraîchissez la page (F5)
- Vérifiez que vous êtes connecté au bon compte

**Vercel ne trouve pas le repository ?**
- Vérifiez que vous vous êtes bien connecté avec GitHub
- Vercel peut demander des permissions supplémentaires

---

## ✅ Récapitulatif rapide

1. GitHub → Settings → Default branch → Choisir ma branche ✅
2. Vercel → Add New → Import domo ✅
3. Ajouter les 3 variables d'environnement ✅
4. Deploy ✅

**Et voilà ! Votre app sera en ligne ! 🚀**

---

📞 **Besoin d'aide ?** Dites-moi où vous êtes bloqué et je vous guiderai !
