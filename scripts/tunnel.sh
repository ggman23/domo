#!/bin/bash

# Script pour créer un tunnel public avec Cloudflared
# Permet d'accéder à l'application depuis Internet

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     🌐 CRÉATION D'UN TUNNEL INTERNET SÉCURISÉ 🌐        ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Vérifier si cloudflared est installé
if ! command -v cloudflared &> /dev/null; then
    echo "⚠️  Cloudflared n'est pas installé."
    echo ""
    echo "📥 Installation automatique..."
    echo ""

    # Détecter l'OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
        sudo dpkg -i cloudflared-linux-amd64.deb
        rm cloudflared-linux-amd64.deb
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install cloudflared
    else
        echo "❌ OS non supporté pour l'installation automatique."
        echo ""
        echo "📝 Installez manuellement depuis :"
        echo "   https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/"
        exit 1
    fi

    echo "✅ Cloudflared installé avec succès !"
    echo ""
fi

echo "🚀 Démarrage du tunnel..."
echo ""
echo "⏳ Patientez quelques secondes..."
echo ""

# Démarrer le tunnel vers le port 3000 (frontend)
cloudflared tunnel --url http://localhost:3000

# Note: Le tunnel restera actif tant que ce script tourne
# Utilisez Ctrl+C pour arrêter le tunnel
