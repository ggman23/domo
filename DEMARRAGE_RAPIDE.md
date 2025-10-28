# 🚀 Démarrage Ultra-Rapide

Votre application est **DÉJÀ CONFIGURÉE** avec vos identifiants Tuya !

## Étape 1 : Installer les dépendances (3 minutes)

```bash
npm run install-all
```

Attendez que toutes les dépendances soient installées.

---

## Étape 2 : Lancer l'application (10 secondes)

```bash
npm run dev
```

**C'est tout !** L'application va :
1. ✅ Se connecter automatiquement à votre compte Tuya
2. ✅ Récupérer automatiquement votre User ID
3. ✅ Charger tous vos appareils Smart Life
4. ✅ Afficher les URLs d'accès

---

## Étape 3 : Ouvrir l'application

### Sur votre ordinateur :
👉 **http://localhost:3000**

### Sur votre téléphone (même WiFi) :
👉 **Cherchez l'URL affichée dans le terminal**, par exemple :
```
📱 Accès RÉSEAU (depuis téléphones/tablettes) :
   → http://192.168.1.100:3000
```

Ouvrez cette URL sur votre téléphone !

---

## ✨ Fonctionnalités disponibles

✅ Voir tous vos appareils Smart Life
✅ État en temps réel (allumé/éteint)
✅ Consommation électrique en direct
✅ Contrôler vos appareils (allumer/éteindre)
✅ Graphiques de consommation
✅ Commandes Google Assistant

---

## 🌐 Accès depuis Internet (optionnel)

Pour accéder depuis l'extérieur de votre maison (4G, autre WiFi, etc.) :

### Dans un NOUVEAU terminal :

```bash
npm run tunnel
```

Vous obtiendrez une URL publique comme :
```
https://random-word-1234.trycloudflare.com
```

**Partagez cette URL avec votre famille !**

---

## 📱 Ajouter à l'écran d'accueil (téléphone)

### Sur iPhone :
1. Ouvrez l'URL dans Safari
2. Appuyez sur le bouton "Partager" (carré avec flèche)
3. Choisissez "Sur l'écran d'accueil"
4. Nommez l'app "Ma Domotique"

### Sur Android :
1. Ouvrez l'URL dans Chrome
2. Appuyez sur les 3 points (⋮)
3. Choisissez "Ajouter à l'écran d'accueil"
4. Nommez l'app "Ma Domotique"

---

## ❓ Problèmes ?

### L'application ne démarre pas
```bash
# Réinstallez les dépendances
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install-all
```

### Aucun appareil n'apparaît
- Vérifiez que vos appareils sont bien dans Smart Life
- Attendez 30 secondes (rechargement automatique)
- Actualisez la page (F5)

### Le téléphone ne peut pas accéder
- Vérifiez que vous êtes sur le même WiFi
- Vérifiez que le pare-feu n'est pas activé
- Utilisez l'URL exacte affichée dans le terminal

---

## 📚 Documentation complète

- **README.md** : Documentation détaillée
- **ACCES_INTERNET.md** : Guide pour accès depuis Internet
- **GUIDE_DEMARRAGE.md** : Guide complet de configuration (si besoin de reconfigurer)

---

## 🎉 C'est tout !

Votre application est prête à l'emploi !

**Commandes utiles :**
- `npm run dev` - Lancer l'application
- `npm run tunnel` - Créer un tunnel Internet
- `Ctrl+C` - Arrêter l'application

Profitez de votre domotique ! 🏠
