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

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID requis',
    });
  }

  try {
    const tuyaAPI = getTuyaAPI();
    const devices = await tuyaAPI.request('GET', `/v1.0/users/${userId}/devices`);

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
