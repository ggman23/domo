// Version simple qui utilise _tuya-simple.js
import tuyaSimple from './_tuya-simple.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID requis',
    });
  }

  try {
    const devices = await tuyaSimple.request('GET', `/v1.0/users/${userId}/devices`);

    return res.status(200).json({
      success: true,
      devices: devices || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
