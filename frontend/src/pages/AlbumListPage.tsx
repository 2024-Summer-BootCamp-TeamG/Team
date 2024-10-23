import { useState, useEffect } from 'react';
import Background from '../components/Background';
import NavBar from '../components/NavBar';
import axiosInstance from '../api/axios';

interface ImageData {
  id: number;
  logo_url: string;
}

function AlbumListPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useEffect triggered'); // useEffect가 호출되는지 확인

    axiosInstance
      .get('/promotions/', {
        withCredentials: true,
      })
      .then((response) => {
        console.log('API response received:', response); // 응답 데이터 로그
        console.log('Session ID:', response.data.sessionid); // 서버에서 받은 세션 ID를 콘솔에 출력

        const data = response.data;
        console.log(response.data.sessionid);
        if (Array.isArray(data)) {
          setImages(data);
          console.log('Images set:', data); // images 상태가 설정되었는지 확인
        } else {
          console.error('Expected an array but received:', data);
          setError('Unexpected response format');
          setImages([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
        setError('Error fetching images');
        setImages([]);
      });
  }, []);

  console.log('Rendering AlbumListPage'); // 컴포넌트가 렌더링되는지 확인

  return (
    <>
      <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-[#000000] bg-cover">
        <Background>
          <NavBar />
          {error ? (
            <div className="text-white">{error}</div>
          ) : (
            <div className="grid grid-cols-3 gap-4 p-4">
              {images.map((image) => (
                <div key={image.id} className="p-2">
                  <img
                    src={image.logo_url}
                    alt={`Album ${image.id}`}
                    className="h-auto w-full border-2 border-white" // 테두리를 추가하여 이미지 확인
                  />
                </div>
              ))}
            </div>
          )}
        </Background>
      </div>
    </>
  );
}

export default AlbumListPage;
