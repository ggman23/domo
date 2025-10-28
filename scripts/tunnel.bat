@echo off
REM Script pour créer un tunnel public avec Cloudflared sur Windows
REM Permet d'accéder à l'application depuis Internet

echo ╔═══════════════════════════════════════════════════════════╗
echo ║     🌐 CRÉATION D'UN TUNNEL INTERNET SÉCURISÉ 🌐        ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

REM Vérifier si cloudflared est installé
where cloudflared >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Cloudflared n'est pas installé.
    echo.
    echo 📥 Téléchargez et installez cloudflared depuis :
    echo    https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
    echo.
    echo Puis relancez ce script.
    pause
    exit /b 1
)

echo 🚀 Démarrage du tunnel...
echo.
echo ⏳ Patientez quelques secondes...
echo.

REM Démarrer le tunnel vers le port 3000 (frontend)
cloudflared tunnel --url http://localhost:3000

REM Note: Le tunnel restera actif tant que cette fenêtre est ouverte
REM Fermez la fenêtre pour arrêter le tunnel
