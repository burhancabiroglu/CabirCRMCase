const encoder = new TextEncoder();
const decoder = new TextDecoder();

const getKey = async (secret: string) => {
  const encoded = new TextEncoder().encode(secret);

  if (encoded.byteLength < 16) {
    throw new Error('Secret key too short for AES. Must be at least 16 bytes.');
  }

  const normalized = encoded.slice(0, 32); // AES-128, 192, 256 compatible
  return await crypto.subtle.importKey(
    'raw',
    normalized,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
};

export async function encodeObject(obj: any, secret: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey(secret);
  const encoded = encoder.encode(JSON.stringify(obj));

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );

  const ivStr = btoa(String.fromCharCode(...iv));
  const dataStr = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  return `${ivStr}.${dataStr}`;
}

export async function decodeObject(token: string, secret: string): Promise<any> {
  const [ivStr, dataStr] = token.split('.');
  if (!ivStr || !dataStr) throw new Error('Invalid token format');

  const iv = Uint8Array.from(atob(ivStr), c => c.charCodeAt(0));
  const data = Uint8Array.from(atob(dataStr), c => c.charCodeAt(0));

  const key = await getKey(secret);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  const json = decoder.decode(decrypted);
  return JSON.parse(json);
}