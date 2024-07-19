// CSRF 토큰을 쿠키에서 가져오는 함수
function getCsrfToken() {
  const cookieValue = document.cookie.match(
    '(^|;)\\s*csrftoken\\s*=\\s*([^;]+)',
  );
  return cookieValue ? cookieValue.pop() : '';
}

// axios 인스턴스 설정
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // 쿠키를 포함하도록 설정
});

// axiosInstance.interceptors.request.use((config) => {
//   const csrfToken = getCsrfToken();
//   if (csrfToken) {
//     config.headers['X-CSRFToken'] = csrfToken;
//   }
//   return config;
// });

export default axiosInstance;
