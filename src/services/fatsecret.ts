export interface FoodServing {
  serving_description: string;
  calories: string;
  carbohydrate: string;
  fat: string;
  protein: string;
  fiber?: string;
  sugar?: string;
}

export interface FoodProduct {
  food_id: string;
  food_name: string;
  food_type: string;
  brand_name?: string;
  servings: {
    serving: FoodServing | FoodServing[];
  };
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

export function getFirstServing(product: FoodProduct): FoodServing | null {
  const { serving } = product.servings;
  if (!serving) return null;
  return Array.isArray(serving) ? serving[0] : serving;
}
