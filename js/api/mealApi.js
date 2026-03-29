const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

async function parseResponse(response, message) {
  if (!response.ok) throw new Error(message);
  return response.json();
}

export async function getHealthyMeals(ingredient = 'chicken_breast') {
  const response = await fetch(`${BASE_URL}/filter.php?i=${ingredient}`);
  const data = await parseResponse(response, 'Không thể tải món ăn.');
  return data.meals || [];
}
