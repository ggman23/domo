import crypto from 'crypto';
import axios from 'axios';

const TUYA_ENDPOINTS = {
  eu: 'https://openapi.tuyaeu.com',
  us: 'https://openapi.tuyaus.com',
  cn: 'https://openapi.tuyacn.com',
  in: 'https://openapi.tuyain.com',
};

class TuyaAPI {
  constructor() {
    // TEMPORAIRE : Credentials en dur pour test
    this.clientId = 'ktuq7y5tgtw5433v8r4s';
    this.clientSecret = '74c7023cc90946128ca8b6f887a4e5cb';
    this.region = 'eu';

    this.baseUrl = TUYA_ENDPOINTS[this.region];
    this.accessToken = null;
    this.tokenExpiry = null;

    console.log('TuyaAPI initialisé avec credentials EN DUR:', {
      clientId: this.clientId.substring(0, 10) + '...',
      clientSecret: this.clientSecret.substring(0, 10) + '...',
      region: this.region,
      baseUrl: this.baseUrl
    });
  }

  generateSignature(method, path, params = {}, body = '', includeToken = true) {
    const timestamp = Date.now().toString();
    const clientId = this.clientId;
    const secret = this.clientSecret;
    const token = this.accessToken || '';

    // Construire la query string
    const queryString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    // Hash du body (SHA256)
    const bodyToHash = body || '';
    const contentHash = crypto
      .createHash('sha256')
      .update(bodyToHash, 'utf8')
      .digest('hex');

    // Construire le stringToSign EXACTEMENT comme dans debug-signature.js
    const url = path + (queryString ? '?' + queryString : '');
    const headers = '';
    const stringToSign = method + '\n' + contentHash + '\n' + headers + '\n' + url;

    // Construire la chaîne à signer
    // Pour l'obtention du token: clientId + timestamp + stringToSign
    // Pour les requêtes avec token: clientId + accessToken + timestamp + stringToSign
    const signStr = (includeToken && token)
      ? clientId + token + timestamp + stringToSign
      : clientId + timestamp + stringToSign;

    // Calculer la signature HMAC-SHA256
    const signature = crypto
      .createHmac('sha256', secret)
      .update(signStr, 'utf8')
      .digest('hex')
      .toUpperCase();

    console.log('🔐 Signature générée - DÉTAILS COMPLETS:', {
      method,
      path,
      params,
      includeToken,
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      url,
      urlLength: url.length,
      contentHash,
      stringToSign,
      stringToSignLength: stringToSign.length,
      signStr: signStr.substring(0, 50) + '...' + signStr.substring(signStr.length - 20),
      signStrLength: signStr.length,
      timestamp,
      signature,
    });

    return {
      timestamp,
      signature,
      clientId,
      token,
    };
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      console.log('✅ Token existant encore valide');
      return this.accessToken;
    }

    console.log('🔑 Récupération d\'un nouveau token Tuya...');

    // IMPORTANT : Vider le token avant d'en obtenir un nouveau
    this.accessToken = null;
    this.tokenExpiry = null;

    const path = '/v1.0/token';
    const method = 'GET';

    // Pour l'obtention du token, on n'inclut PAS le token dans la signature
    const signData = this.generateSignature(method, path, { grant_type: 1 }, '', false);

    try {
      // L'URL complète pour axios
      const fullUrl = this.baseUrl + path + '?grant_type=1';

      console.log('📡 Appel Tuya:', {
        method,
        url: fullUrl,
        headers: {
          client_id: signData.clientId.substring(0, 10) + '...',
          sign: signData.signature.substring(0, 20) + '...',
          t: signData.timestamp,
        }
      });

      const response = await axios({
        method,
        url: fullUrl,
        headers: {
          client_id: signData.clientId,
          sign: signData.signature,
          t: signData.timestamp,
          sign_method: 'HMAC-SHA256',
        },
      });

      console.log('📥 Réponse Tuya:', {
        success: response.data.success,
        code: response.data.code,
        msg: response.data.msg,
        hasResult: !!response.data.result,
      });

      if (response.data.success) {
        const receivedToken = response.data.result.access_token;
        console.log('🔑 Token reçu de Tuya:', {
          tokenStart: receivedToken.substring(0, 30),
          tokenEnd: receivedToken.substring(receivedToken.length - 10),
          tokenLength: receivedToken.length,
          tokenType: typeof receivedToken,
        });

        this.accessToken = receivedToken;
        this.tokenExpiry = Date.now() + (response.data.result.expire_time * 1000);
        console.log('✅ Token stocké avec succès');
        console.log('   this.accessToken length:', this.accessToken.length);
        return this.accessToken;
      } else {
        console.error('❌ Erreur Tuya:', response.data);
        throw new Error(response.data.msg || 'Échec de l\'authentification Tuya');
      }
    } catch (error) {
      if (error.response) {
        console.error('❌ Erreur HTTP:', {
          status: error.response.status,
          data: error.response.data,
        });
      } else {
        console.error('❌ Erreur réseau:', error.message);
      }
      throw error;
    }
  }

  async request(method, path, body = null) {
    await this.getAccessToken();

    const bodyStr = body ? JSON.stringify(body) : '';

    // IMPORTANT: includeToken=true pour les requêtes avec token
    const signData = this.generateSignature(method, path, {}, bodyStr, true);

    console.log(`📡 Requête Tuya: ${method} ${path}`);
    console.log(`   Token disponible: ${!!this.accessToken}`);
    console.log(`   Token COMPLET: "${this.accessToken}"`);
    console.log(`   Token length: ${this.accessToken ? this.accessToken.length : 0}`);

    try {
      const response = await axios({
        method,
        url: this.baseUrl + path,
        headers: {
          client_id: signData.clientId,
          sign: signData.signature,
          t: signData.timestamp,
          sign_method: 'HMAC-SHA256',
          access_token: this.accessToken,
          'Content-Type': 'application/json',
        },
        data: body,
      });

      console.log('📥 Réponse:', {
        success: response.data.success,
        code: response.data.code,
        msg: response.data.msg,
      });

      if (response.data.success) {
        return response.data.result;
      } else {
        console.error('❌ Erreur API Tuya:', response.data);
        throw new Error(response.data.msg || 'Erreur API Tuya');
      }
    } catch (error) {
      console.error('❌ Erreur requête:', error.response?.data || error.message);
      throw error;
    }
  }
}

// Instance partagée - RÉUTILISER la même instance
let tuyaInstance = null;

function getTuyaAPI() {
  if (!tuyaInstance) {
    console.log('🔄 Création d\'une NOUVELLE instance TuyaAPI');
    tuyaInstance = new TuyaAPI();
  } else {
    console.log('♻️ Réutilisation de l\'instance TuyaAPI existante');
  }
  return tuyaInstance;
}

export default getTuyaAPI;
