import getTuyaAPI from './_tuya.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Méthode non autorisée',
    });
  }

  const { deviceId, action } = req.query;
  const { commands } = req.body;

  if (!deviceId) {
    return res.status(400).json({
      success: false,
      message: 'Device ID requis',
    });
  }

  try {
    const tuyaAPI = getTuyaAPI();

    let commandsToSend = commands;

    // Actions prédéfinies
    if (action === 'on') {
      commandsToSend = [{ code: 'switch_1', value: true }];
    } else if (action === 'off') {
      commandsToSend = [{ code: 'switch_1', value: false }];
    }

    if (!commandsToSend || !Array.isArray(commandsToSend)) {
      return res.status(400).json({
        success: false,
        message: 'Commandes invalides',
      });
    }

    const result = await tuyaAPI.request('POST', `/v1.0/devices/${deviceId}/commands`, {
      commands: commandsToSend,
    });

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
