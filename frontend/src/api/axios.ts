// axios.ts 파일

import axios from 'axios';
// const apiUrl = process.env.REACT_APP_API_URL || 'https://brandifyy.site/api';

const axiosInstance = axios.create({
  baseURL: 'https://brandifyy.site/api', // 서버의 baseURL에 맞게 설정
  timeout: 10000, // 요청 타임아웃 설정 (ms)
  withCredentials: true, // 쿠키 및 인증 정보를 포함한 요청을 보낼 때 설정
});

export default axiosInstance;
