# ⚡ Déploiement Vercel - Version Ultra-Rapide

## 🎯 En 5 minutes chrono !

### Étape 1 : Se connecter à Vercel
👉 [https://vercel.com](https://vercel.com)
- Cliquez sur **Sign Up** ou **Log in**
- Choisissez **Continue with GitHub**

---

### Étape 2 : Importer le projet

1. Sur le dashboard, cliquez sur **Add New...** → **Project**
2. Trouvez le repository `domo`
3. Cliquez sur **Import**

---

### Étape 3 : Configurer (IMPORTANT !)

#### Build Settings
Vercel détecte automatiquement tout. **Ne changez rien !**

#### Variables d'environnement
Cliquez sur **Environment Variables** et ajoutez :

```
TUYA_CLIENT_ID = ktuq7y5tgtw5433v8r4s
TUYA_CLIENT_SECRET = 74c7023cc90946128ca8b6f887a4e5cb
TUYA_REGION = eu
```

**Assurez-vous que "Production", "Preview" et "Development" sont cochés !**

---

### Étape 4 : Déployer !

Cliquez sur **Deploy** → Attendez 2-3 minutes → ✅ C'est en ligne !

---

### Étape 5 : Tester

Ouvrez l'URL fournie par Vercel :
```
https://votre-projet.vercel.app
```

**C'est tout ! 🎉**

---

## 📱 Partager avec la famille

Envoyez l'URL `https://votre-projet.vercel.app` à toute votre famille !

Ils peuvent l'ajouter à leur écran d'accueil :
- **iPhone** : Safari → Partager → "Sur l'écran d'accueil"
- **Android** : Chrome → Menu → "Ajouter à l'écran d'accueil"

---

## ⚠️ Problème ?

### L'app ne charge pas les appareils

1. Allez dans **Settings** → **Environment Variables**
2. Vérifiez que les 3 variables sont présentes
3. Si besoin, allez dans **Deployments** → **Redeploy**

### Logs d'erreur

1. **Deployments** → Cliquez sur le dernier
2. **Functions** → Sélectionnez une API
3. Consultez les logs

---

## 📖 Guide complet

Pour plus de détails, consultez [DEPLOIEMENT_VERCEL.md](DEPLOIEMENT_VERCEL.md)

---

🚀 **Votre domotique accessible partout dans le monde !**
