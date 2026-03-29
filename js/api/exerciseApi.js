const BASE_URL = 'https://wger.de/api/v2/exerciseinfo/';

async function parseResponse(response, message) {
  if (!response.ok) throw new Error(message);
  return response.json();
}

function normalizeExercise(item) {
  const translation = item.translations?.find(entry => entry.language === 2) || item.translations?.[0] || {};
  const muscles = (item.muscles_secondary?.length ? item.muscles_secondary : item.muscles).map(muscle => muscle.name_en || muscle.name || 'Unknown');
  return {
    id: item.id,
    name: translation.name || item.name || 'Exercise',
    description: translation.description || 'Không có mô tả chi tiết.',
    category: item.category?.name || 'General',
    muscles,
    image: item.images?.[0]?.image || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    muscle: muscles[0] || item.category?.name || 'General',
    calories: Math.max(80, (item.muscles?.length || 1) * 90 + 60)
  };
}

export async function getExercises(limit = 18) {
  const response = await fetch(`${BASE_URL}?limit=${limit}&language=2`);
  const data = await parseResponse(response, 'Không thể tải bài tập.');
  return data.results.map(normalizeExercise);
}

export async function getExerciseById(id) {
  const response = await fetch(`${BASE_URL}${id}/?language=2`);
  const data = await parseResponse(response, 'Không thể tải chi tiết bài tập.');
  return normalizeExercise(data);
}
