// axios.ts 파일

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // 서버의 baseURL에 맞게 설정
  timeout: 10000, // 요청 타임아웃 설정 (ms)
  withCredentials: true, // 쿠키 및 인증 정보를 포함한 요청을 보낼 때 설정
});

export default axiosInstance;
