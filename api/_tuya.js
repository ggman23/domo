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
    // Lire les variables d'environnement à l'exécution, pas au chargement du module
    this.clientId = process.env.TUYA_CLIENT_ID;
    this.clientSecret = process.env.TUYA_CLIENT_SECRET;
    this.region = process.env.TUYA_REGION || 'eu';

    // Vérifier que les variables sont bien définies
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Variables d\'environnement TUYA_CLIENT_ID et TUYA_CLIENT_SECRET requises');
    }

    this.baseUrl = TUYA_ENDPOINTS[this.region];
    this.accessToken = null;
    this.tokenExpiry = null;

    console.log('TuyaAPI initialisé avec:', {
      clientId: this.clientId ? `${this.clientId.substring(0, 5)}...` : 'MANQUANT',
      clientSecret: this.clientSecret ? '***' : 'MANQUANT',
      region: this.region,
      baseUrl: this.baseUrl
    });
  }

  generateSignature(method, path, params = {}, body = '') {
    const timestamp = Date.now().toString();
    const clientId = this.clientId;
    const secret = this.clientSecret;
    const token = this.accessToken || '';

    // Construire la query string si params
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    // Hash du body (SHA256 de la chaîne vide si pas de body)
    const bodyToHash = body || '';
    const contentHash = crypto
      .createHash('sha256')
      .update(bodyToHash, 'utf8')
      .digest('hex');

    // Construire le stringToSign selon la spec Tuya
    // Format: method + "\n" + contentHash + "\n" + headers + "\n" + url
    const url = path + (sortedParams ? `?${sortedParams}` : '');
    const stringToSign = [
      method,
      contentHash,
      '', // headers vides
      url,
    ].join('\n');

    // Construire la chaîne à signer
    const signStr = clientId + token + timestamp + stringToSign;

    // Calculer la signature HMAC-SHA256
    const signature = crypto
      .createHmac('sha256', secret)
      .update(signStr, 'utf8')
      .digest('hex')
      .toUpperCase();

    console.log('🔐 Signature générée:', {
      method,
      path,
      params,
      contentHash: contentHash.substring(0, 10) + '...',
      timestamp,
      signature: signature.substring(0, 10) + '...',
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

    const path = '/v1.0/token';
    const method = 'GET';
    const params = { grant_type: 1 }; // Nombre, pas chaîne
    const signData = this.generateSignature(method, path, params, '');

    try {
      const url = this.baseUrl + path + '?grant_type=1';
      console.log('📡 Appel Tuya:', { method, url });

      const response = await axios({
        method,
        url,
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
      });

      if (response.data.success) {
        this.accessToken = response.data.result.access_token;
        this.tokenExpiry = Date.now() + (response.data.result.expire_time * 1000);
        console.log('✅ Token obtenu avec succès');
        return this.accessToken;
      } else {
        console.error('❌ Erreur Tuya:', response.data);
        throw new Error(response.data.msg || 'Échec de l\'authentification Tuya');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'appel Tuya:', error.response?.data || error.message);
      throw error;
    }
  }

  async request(method, path, body = null) {
    await this.getAccessToken();

    const bodyStr = body ? JSON.stringify(body) : '';
    const signData = this.generateSignature(method, path, {}, bodyStr);

    try {
      console.log(`📡 Requête Tuya: ${method} ${path}`);

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

// Instance partagée
let tuyaInstance = null;

function getTuyaAPI() {
  if (!tuyaInstance) {
    tuyaInstance = new TuyaAPI();
  }
  return tuyaInstance;
}

export default getTuyaAPI;
