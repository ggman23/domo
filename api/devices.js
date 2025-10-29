// Test de requête AVEC token (obtenir devices)
import crypto from 'crypto';
import axios from 'axios';

const CREDS = {
  clientId: 'ktuq7y5tgtw5433v8r4s',
  clientSecret: '74c7023cc90946128ca8b6f887a4e5cb',
  baseUrl: 'https://openapi.tuyaeu.com',
};

async function getToken() {
  const method = 'GET';
  const path = '/v1.0/token';
  const timestamp = Date.now().toString();
  const queryString = 'grant_type=1';

  const contentHash = crypto.createHash('sha256').update('', 'utf8').digest('hex');
  const url = path + '?' + queryString;
  const stringToSign = method + '\n' + contentHash + '\n' + '\n' + url;
  const signStr = CREDS.clientId + timestamp + stringToSign;
  const signature = crypto.createHmac('sha256', CREDS.clientSecret).update(signStr, 'utf8').digest('hex').toUpperCase();

  const response = await axios({
    method: 'GET',
    url: CREDS.baseUrl + path + '?' + queryString,
    headers: {
      client_id: CREDS.clientId,
      sign: signature,
      t: timestamp,
      sign_method: 'HMAC-SHA256',
    },
  });

  return response.data.result.access_token;
}

async function makeAuthenticatedRequest(accessToken, method, path, queryString = '') {
  const timestamp = Date.now().toString();
  const contentHash = crypto.createHash('sha256').update('', 'utf8').digest('hex');
  const url = queryString ? path + '?' + queryString : path;
  const stringToSign = method + '\n' + contentHash + '\n' + '\n' + url;
  const signStr = CREDS.clientId + accessToken + timestamp + stringToSign;
  const signature = crypto.createHmac('sha256', CREDS.clientSecret).update(signStr, 'utf8').digest('hex').toUpperCase();

  const fullUrl = CREDS.baseUrl + path + (queryString ? '?' + queryString : '');

  return await axios({
    method,
    url: fullUrl,
    headers: {
      client_id: CREDS.clientId,
      sign: signature,
      t: timestamp,
      sign_method: 'HMAC-SHA256',
      access_token: accessToken,
    },
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Obtenir le token
    const accessToken = await getToken();
    console.log('✅ Token obtenu');

    const userId = 'eu16951695278972Gsux';

    // Stratégie: Récupérer les appareils de TOUTES les maisons
    console.log('📱 Récupération des maisons (homes)...');
    const homesResponse = await makeAuthenticatedRequest(
      accessToken,
      'GET',
      `/v1.0/users/${userId}/homes`
    );

    const homes = homesResponse.data.result || [];
    console.log(`🏠 Nombre de maisons trouvées: ${homes.length}`);

    // Récupérer les appareils de chaque maison
    let allDevices = [];

    for (const home of homes) {
      console.log(`📍 Récupération des appareils de la maison: ${home.name} (ID: ${home.home_id})`);

      try {
        const devicesResponse = await makeAuthenticatedRequest(
          accessToken,
          'GET',
          `/v1.0/homes/${home.home_id}/devices`
        );

        const homeDevices = devicesResponse.data.result || [];
        console.log(`  ✅ ${homeDevices.length} appareils trouvés`);

        allDevices = allDevices.concat(homeDevices);
      } catch (error) {
        console.error(`  ❌ Erreur pour la maison ${home.name}:`, error.response?.data || error.message);
      }
    }

    // Dédupliquer par device ID (au cas où)
    const uniqueDevices = Array.from(
      new Map(allDevices.map(device => [device.id, device])).values()
    );

    console.log(`🎯 Total appareils uniques: ${uniqueDevices.length}`);

    return res.status(200).json({
      success: true,
      message: `✅ ${uniqueDevices.length} appareils trouvés dans ${homes.length} maison(s)`,
      devices: uniqueDevices,
      homes: homes.map(h => ({ id: h.home_id, name: h.name }))
    });

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: '❌ Erreur',
      error: error.response?.data || error.message,
    });
  }
}
