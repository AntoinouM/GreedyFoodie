const TOKEN_URL = 'https://oauth.fatsecret.com/connect/token';
const BARCODE_URL =
  'https://platform.fatsecret.com/rest/food/barcode/find-by-id/v2';

// These are server-only env vars — never sent to the client
const CLIENT_ID = process.env.FATSECRET_CLIENT_ID!;
const CLIENT_SECRET = process.env.FATSECRET_CLIENT_SECRET!;

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials&scope=basic',
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.token;
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const barcode = searchParams.get('barcode');

  if (!barcode || !/^\d+$/.test(barcode)) {
    return Response.json({ error: 'Invalid barcode' }, { status: 400 });
  }

  try {
    const token = await getAccessToken();
    const normalizedBarcode = barcode.replace(/\D/g, '').padStart(13, '0');

    const findRes = await fetch(
      `${BARCODE_URL}?barcode=${normalizedBarcode}&region=AT&format=json`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (!findRes.ok) {
      return Response.json({ error: 'Barcode lookup failed' }, { status: 502 });
    }

    const findData = await findRes.json();
    console.log('[barcode API] raw response:', JSON.stringify(findData));

    // v2 returns the full food object directly (same shape as food.get.v5)
    // or error code 211 if not found
    if (findData?.error?.code === 211 || !findData?.food) {
      return Response.json({ food: null });
    }

    return Response.json({ food: findData.food });
  } catch (err) {
    console.error('[barcode API]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
