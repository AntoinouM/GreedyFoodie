// Nutriments from Open Food Facts — values are per 100g
export interface FoodNutriments {
  energy_kcal_100g?: number;
  proteins_100g?: number;
  carbohydrates_100g?: number;
  fat_100g?: number;
  fiber_100g?: number;
  sugars_100g?: number;
  [key: string]: number | undefined;
}

export interface FoodProduct {
  product_name: string;
  brands?: string;
  quantity?: string;
  nutriments: FoodNutriments;
  serving_size?: string;
}

export async function searchByBarcode(
  barcode: string,
): Promise<FoodProduct | null> {
  const normalizedBarcode = barcode.replace(/\D/g, '').padStart(13, '0');

  const response = await fetch(`/api/barcode?barcode=${normalizedBarcode}`);

  if (!response.ok) {
    throw new Error(`Barcode lookup failed: ${response.status}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.food ?? null;
}
