const { generateKeyPairSync } = require('crypto');

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

const publicKeyBody = publicKey
  .replace(/-----BEGIN PUBLIC KEY-----/g, '')
  .replace(/-----END PUBLIC KEY-----/g, '')
  .replace(/\s/g, '');

const privateKeyBase64 = Buffer.from(privateKey, 'utf8').toString('base64');

console.log('Paste this Public Key value into Unit Dashboard > Settings > Authentication > Public Key:');
console.log(publicKeyBody);
console.log('');
console.log('Set this as the Supabase secret UNIT_JWT_PRIVATE_KEY_BASE64:');
console.log(privateKeyBase64);
console.log('');
console.log('Keep the private key secret. Do not put it in Expo or Vercel public env vars.');
