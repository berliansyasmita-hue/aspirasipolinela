const SECRET = process.env.SESSION_SECRET || "polinela-advokesma-super-secret-key-32-chars-long";

// Helper untuk konversi Uint8Array ke Hex String (Edge-safe)
function uint8ArrayToHex(arr: Uint8Array): string {
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper untuk konversi Hex String ke Uint8Array (Edge-safe)
function hexToUint8Array(hex: string): Uint8Array {
  const view = new Uint8Array(hex.length / 2);
  for (let i = 0; i < view.length; i++) {
    view[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return view;
}

// Gunakan global crypto API yang dijamin ada di Next.js (Edge Runtime) & Node.js 18+
const cryptoModule = globalThis.crypto;

async function getCryptoKey() {
  const keyBuffer = new TextEncoder().encode(SECRET.padEnd(32).slice(0, 32));
  return await cryptoModule.subtle.importKey(
    "raw",
    keyBuffer as any,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(payload: any) {
  const key = await getCryptoKey();
  const iv = cryptoModule.getRandomValues(new Uint8Array(12)); // 12 bytes untuk AES-GCM
  const data = new TextEncoder().encode(JSON.stringify(payload));
  const encrypted = await cryptoModule.subtle.encrypt(
    { name: "AES-GCM", iv: iv as any },
    key,
    data as any
  );
  
  const ivHex = uint8ArrayToHex(iv);
  const encryptedHex = uint8ArrayToHex(new Uint8Array(encrypted));
  return `${ivHex}:${encryptedHex}`;
}

export async function decrypt(token: string) {
  try {
    const [ivHex, encryptedHex] = token.split(":");
    if (!ivHex || !encryptedHex) return null;
    
    const key = await getCryptoKey();
    const iv = hexToUint8Array(ivHex);
    const encrypted = hexToUint8Array(encryptedHex);
    
    const decrypted = await cryptoModule.subtle.decrypt(
      { name: "AES-GCM", iv: iv as any },
      key,
      encrypted as any
    );
    
    return JSON.parse(new TextDecoder().decode(decrypted));
  } catch (error) {
    return null;
  }
}
