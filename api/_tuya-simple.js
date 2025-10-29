// Version SIMPLE qui copie EXACTEMENT ce qui fonctionne dans test-with-token.js
import crypto from 'crypto';
import axios from 'axios';

const CREDS = {
  clientId: 'ktuq7y5tgtw5433v8r4s',
  clientSecret: '74c7023cc90946128ca8b6f887a4e5cb',
  baseUrl: 'https://openapi.tuyaeu.com',
};

// Cache du token
let cachedToken = null;
let tokenExpiry = null;

async function getToken() {
  // Si on a un token valide en cache, le retourner
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log('✅ Token en cache encore valide');
    return cachedToken;
  }

  console.log('🔑 Obtention d\'un nouveau token...');

  // Obtenir un nouveau token
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

  if (!response.data.success) {
    throw new Error(response.data.msg || 'Erreur obtention token');
  }

  cachedToken = response.data.result.access_token;
  tokenExpiry = Date.now() + (response.data.result.expire_time * 1000);

  console.log('✅ Token obtenu:', cachedToken.substring(0, 20) + '...');
  return cachedToken;
}

async function request(method, path, body = null) {
  const accessToken = await getToken();

  const timestamp = Date.now().toString();
  const bodyStr = body ? JSON.stringify(body) : '';
  const contentHash = crypto.createHash('sha256').update(bodyStr, 'utf8').digest('hex');

  const url = path;
  const stringToSign = method + '\n' + contentHash + '\n' + '\n' + url;
  const signStr = CREDS.clientId + accessToken + timestamp + stringToSign;
  const signature = crypto.createHmac('sha256', CREDS.clientSecret).update(signStr, 'utf8').digest('hex').toUpperCase();

  console.log(`📡 Requête: ${method} ${path}`);

  const response = await axios({
    method,
    url: CREDS.baseUrl + path,
    headers: {
      client_id: CREDS.clientId,
      sign: signature,
      t: timestamp,
      sign_method: 'HMAC-SHA256',
      access_token: accessToken,
      'Content-Type': 'application/json',
    },
    data: body,
  });

  if (!response.data.success) {
    throw new Error(response.data.msg || 'Erreur API');
  }

  return response.data.result;
}

export default {
  request,
  getToken,
};
