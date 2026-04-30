const OFF_URL = 'https://world.openfoodfacts.org/api/v0/product';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const barcode = searchParams.get('barcode');

  if (!barcode || !/^\d+$/.test(barcode)) {
    return Response.json({ error: 'Invalid barcode' }, { status: 400 });
  }

  try {
    const res = await fetch(`${OFF_URL}/${barcode}.json`, {
      headers: { 'User-Agent': 'GreedyFoodie/1.0 (contact@greedyfoodie.app)' },
    });

    if (!res.ok) {
      return Response.json({ error: 'Lookup failed' }, { status: 502 });
    }

    const data = await res.json();

    if (data.status === 0 || !data.product) {
      return Response.json({ food: null });
    }

    return Response.json({ food: data.product });
  } catch (err) {
    console.error('[barcode API]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
