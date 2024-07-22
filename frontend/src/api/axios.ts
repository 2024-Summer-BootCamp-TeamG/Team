import axios from 'axios';

// Axios 인스턴스를 생성할 때 withCredentials를 true로 설정하여 쿠키를 포함
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // 서버의 기본 URL
  withCredentials: true, // 쿠키를 포함하여 요청
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request config:', config); // 요청 설정 로그 출력
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 추가 (선택 사항)
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response data:', response.data); // 응답 데이터 로그 출력
    return response;
  },
  (error) => {
    console.error('Response error:', error); // 응답 오류 로그 출력
    return Promise.reject(error);
  },
);

export default axiosInstance;
