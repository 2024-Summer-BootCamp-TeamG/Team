const getSessionId = () => {
  const name = 'sessionid=';
  const decodedCookie = decodeURIComponent(document.cookie);
  console.log('Cookies:', decodedCookie); // 쿠키를 로그로 출력
  const cookies = decodedCookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith(name)) {
      const sessionId = cookie.substring(name.length);
      console.log('Found session ID:', sessionId); // 찾은 세션 ID 로그 출력
      return sessionId;
    }
  }
  console.log('Session ID not found'); // 세션 ID를 찾지 못한 경우 로그 출력
  return '';
};

export default getSessionId;
