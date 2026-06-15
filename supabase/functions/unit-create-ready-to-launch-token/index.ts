import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { requireUser } from '../_shared/supabase.ts';

function base64UrlEncode(input: ArrayBuffer | Uint8Array | string) {
  const bytes = typeof input === 'string'
    ? new TextEncoder().encode(input)
    : input instanceof Uint8Array
      ? input
      : new Uint8Array(input);

  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function getPrivateKeyPem() {
  const privateKey = Deno.env.get('UNIT_JWT_PRIVATE_KEY');
  if (privateKey) return privateKey.replace(/\\n/g, '\n');

  const privateKeyBase64 = Deno.env.get('UNIT_JWT_PRIVATE_KEY_BASE64');
  if (privateKeyBase64) return atob(privateKeyBase64);

  throw new Error('Missing UNIT_JWT_PRIVATE_KEY_BASE64 or UNIT_JWT_PRIVATE_KEY');
}

function pemToArrayBuffer(pem: string) {
  const body = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s/g, '');

  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}

async function signReadyToLaunchJwt(payload: Record<string, unknown>) {
  const issuer = Deno.env.get('UNIT_JWT_ISSUER');
  if (!issuer) throw new Error('Missing UNIT_JWT_ISSUER');

  const keyId = Deno.env.get('UNIT_JWT_KEY_ID');
  const header: Record<string, string> = {
    alg: 'RS256',
    typ: 'JWT',
  };

  if (keyId) header.kid = keyId;

  const signingInput = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify({
    ...payload,
    iss: issuer,
  }))}`;

  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(getPrivateKeyPem()),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    new TextEncoder().encode(signingInput),
  );

  return `${signingInput}.${base64UrlEncode(signature)}`;
}

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const { user, adminClient } = await requireUser(req);
    const { data: profile } = await adminClient
      .from('profiles')
      .select('email,first_name,last_name,full_name,username')
      .eq('id', user.id)
      .maybeSingle();

    const now = Math.floor(Date.now() / 1000);
    const fullName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() ||
      profile?.full_name ||
      profile?.username ||
      user.email ||
      user.id;

    const token = await signReadyToLaunchJwt({
      sub: user.id,
      exp: now + 15 * 60,
      iat: now,
      email: profile?.email || user.email || undefined,
      name: fullName,
      unitRole: 'Admin',
    });

    return jsonResponse({
      token,
      environment: (Deno.env.get('UNIT_ENV') || 'sandbox').toLowerCase(),
    });
  } catch (error) {
    return jsonResponse({ error: error.message }, 400);
  }
});
