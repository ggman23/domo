import getTuyaAPI from './_tuya.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { deviceId } = req.query;

  if (!deviceId) {
    return res.status(400).json({
      success: false,
      message: 'Device ID requis',
    });
  }

  try {
    const tuyaAPI = getTuyaAPI();
    const status = await tuyaAPI.request('GET', `/v1.0/devices/${deviceId}/status`);

    return res.status(200).json({
      success: true,
      status: status || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
