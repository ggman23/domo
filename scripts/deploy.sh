#!/bin/bash

# Script de déploiement automatique

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║          🚀 DÉPLOIEMENT DE L'APPLICATION 🚀              ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher un message de succès
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Fonction pour afficher un message d'erreur
error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Fonction pour afficher un message d'info
info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    error "Node.js n'est pas installé. Installez-le depuis https://nodejs.org"
fi

success "Node.js détecté : $(node --version)"

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    error "npm n'est pas installé"
fi

success "npm détecté : $(npm --version)"

echo ""
info "Installation des dépendances..."
echo ""

# Installer les dépendances
npm run install-all || error "Échec de l'installation des dépendances"

success "Dépendances installées avec succès"
echo ""

# Vérifier si le fichier .env existe
if [ ! -f "backend/.env" ]; then
    info "Fichier .env non trouvé, création depuis .env.example..."
    cp backend/.env.example backend/.env
    info "⚠️  Pensez à configurer le fichier backend/.env avec vos identifiants Tuya"
else
    success "Fichier .env détecté"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║             ✨ INSTALLATION TERMINÉE ✨                  ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

info "Pour lancer l'application :"
echo ""
echo "    npm run dev"
echo ""

info "Pour créer un tunnel Internet :"
echo ""
echo "    npm run tunnel"
echo ""

success "Tout est prêt ! Bon développement ! 🎉"
