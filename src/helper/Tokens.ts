const base64urlEncode = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const randomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const generateFakeJWT = (): string => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    sub: randomString(10),
    name: randomString(8),
    iat: Math.floor(Date.now() / 1000),
  };

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signature = base64urlEncode(randomString(32));

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}
