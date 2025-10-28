// Endpoint de diagnostic pour vérifier les variables d'environnement
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Vérifier les variables d'environnement
  const envCheck = {
    TUYA_CLIENT_ID: process.env.TUYA_CLIENT_ID ? `${process.env.TUYA_CLIENT_ID.substring(0, 5)}...` : '❌ MANQUANT',
    TUYA_CLIENT_SECRET: process.env.TUYA_CLIENT_SECRET ? '✓ Défini (caché)' : '❌ MANQUANT',
    TUYA_REGION: process.env.TUYA_REGION || 'eu (par défaut)',
    nodeVersion: process.version,
    platform: process.platform,
  };

  return res.status(200).json({
    success: true,
    message: 'Diagnostic des variables d\'environnement',
    environment: envCheck,
    allEnvVarsCount: Object.keys(process.env).length,
  });
}
