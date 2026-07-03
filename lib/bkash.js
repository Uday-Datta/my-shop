let tokenCache = null;
let tokenExpiry = null;

export async function getBkashToken() {
  // Reuse cached token if still valid
  if (tokenCache && tokenExpiry && Date.now() < tokenExpiry) {
    return tokenCache;
  }

  const res = await fetch(process.env.BKASH_GRANT_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      username: process.env.BKASH_USERNAME,
      password: process.env.BKASH_PASSWORD,
    },
    body: JSON.stringify({
      app_key: process.env.BKASH_API_KEY,
      app_secret: process.env.BKASH_SECRET_KEY,
    }),
  });

  const data = await res.json();

  if (!data.id_token) {
    throw new Error("Failed to get bKash token");
  }

  // Cache token for 55 minutes (expires in 60)
  tokenCache = data.id_token;
  tokenExpiry = Date.now() + 55 * 60 * 1000;

  return tokenCache;
}
