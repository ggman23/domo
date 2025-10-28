import getTuyaAPI from './_tuya.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const tuyaAPI = getTuyaAPI();

    // Auto-découverte du User ID
    try {
      const devices = await tuyaAPI.request('GET', '/v1.0/devices');

      if (devices && devices.length > 0) {
        const uid = devices[0].uid;
        return res.status(200).json({
          success: true,
          userId: uid,
          message: 'User ID trouvé automatiquement',
        });
      }
    } catch (error) {
      console.error('Erreur devices:', error.message);
    }

    // Alternative
    try {
      const users = await tuyaAPI.request('GET', '/v1.0/iot-01/associated-users/actions/query');

      if (users && users.list && users.list.length > 0) {
        const uid = users.list[0].uid;
        return res.status(200).json({
          success: true,
          userId: uid,
          message: 'User ID trouvé via associated-users',
        });
      }
    } catch (error) {
      console.error('Erreur users:', error.message);
    }

    return res.status(404).json({
      success: false,
      message: 'Impossible de trouver le User ID automatiquement',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
