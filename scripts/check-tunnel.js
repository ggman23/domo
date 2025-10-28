#!/usr/bin/env node

// Script pour vérifier si cloudflared est installé et le lancer

import { spawn } from 'child_process';
import { platform } from 'os';

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║     🌐 CRÉATION D\'UN TUNNEL INTERNET SÉCURISÉ 🌐        ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// Vérifier si cloudflared est installé
const checkCommand = platform() === 'win32' ? 'where' : 'which';
const checkCloudflared = spawn(checkCommand, ['cloudflared']);

checkCloudflared.on('close', (code) => {
  if (code !== 0) {
    console.log('⚠️  Cloudflared n\'est pas installé.\n');
    console.log('📥 Pour l\'installer :\n');

    if (platform() === 'win32') {
      console.log('   Windows :');
      console.log('   1. Téléchargez depuis : https://github.com/cloudflare/cloudflared/releases/latest');
      console.log('   2. Installez le fichier .msi');
      console.log('   3. Relancez : npm run tunnel\n');
    } else if (platform() === 'darwin') {
      console.log('   macOS :');
      console.log('   brew install cloudflared\n');
    } else {
      console.log('   Linux :');
      console.log('   wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb');
      console.log('   sudo dpkg -i cloudflared-linux-amd64.deb\n');
    }

    console.log('📖 Plus d\'infos : consultez le fichier ACCES_INTERNET.md\n');
    process.exit(1);
  }

  // Cloudflared est installé, le lancer
  console.log('✅ Cloudflared détecté !\n');
  console.log('🚀 Démarrage du tunnel...\n');
  console.log('⏳ Patientez quelques secondes pour obtenir votre URL publique...\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const tunnel = spawn('cloudflared', ['tunnel', '--url', 'http://localhost:3000'], {
    stdio: 'inherit',
  });

  tunnel.on('error', (err) => {
    console.error('❌ Erreur lors du démarrage du tunnel:', err.message);
    process.exit(1);
  });

  // Gérer Ctrl+C proprement
  process.on('SIGINT', () => {
    console.log('\n\n⛔ Arrêt du tunnel...');
    tunnel.kill();
    process.exit(0);
  });
});
