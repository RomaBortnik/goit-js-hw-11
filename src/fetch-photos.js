import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const PERSONAL_KEY = '34315527-c905e7d0ccc489dbd5469a006';

export async function fetchPhotos(value) {
  const params = new URLSearchParams({
    key: PERSONAL_KEY,
    q: `${value}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: '1',
    per_page: '40',
  });

  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
}
