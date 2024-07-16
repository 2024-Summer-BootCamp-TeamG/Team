import React, { useState } from 'react';
import axios from 'axios';
import Background from '../components/Background';
import NavBar from '../components/NavBar';
// Input 컴포넌트 정의
const Input: React.FC<{
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ type, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="custom-placeholder h-full w-full rounded-[1.25rem] border-gray-300 bg-white bg-opacity-30 p-2 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

// Button 컴포넌트 정의
const Button: React.FC<{
  type: 'button' | 'submit' | 'reset';
  label: string;
  onClick: () => void;
}> = ({ type, label, onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="h-[3.75rem] w-full rounded-[1.5rem] bg-white px-4 py-2 text-black hover:bg-black/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
    >
      {label}
    </button>
  );
};

// SignInPage 컴포넌트 정의
function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 사용자 이름 변경 처리 함수
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  // 비밀번호 변경 처리 함수
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // 로그인 버튼 클릭 처리 함수
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        'http://0.0.0.0:8000/users/signin',
        {
          email: username, // 서버 API가 email 필드를 요구한다고 가정
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        alert('로그인이 성공적으로 완료되었습니다.');
        // 여기서 로그인 성공 후의 로직을 추가할 수 있습니다. 예를 들어, 리다이렉션 등.
      } else {
        alert('로그인에 실패했습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // 서버 응답이 400 상태 코드일 경우의 처리
          alert(
            `로그인 도중 오류가 발생했습니다: ${error.response.data.message || error.response.data}`,
          );
        } else {
          alert('로그인 도중 오류가 발생했습니다.');
        }
        console.error('There was an error!', error);
      }
    }
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-cover">
      <Background>
        <NavBar />
        <div className="relative h-[67.5rem] w-[120rem]">
          {/* 로그인 박스 */}
          <div className="absolute left-[35rem] top-[7.19rem] h-[53.13rem] w-[50rem] rounded-[2.5rem] border-2 border-white bg-white/30 opacity-60 shadow backdrop-blur-[3.44rem]" />

          {/* 비밀번호 입력 필드 */}
          <div className="bg-white/opacity-20 absolute left-[47.5rem] top-[38rem] h-[3.75rem] w-[25rem] rounded-[1.25rem] border-2 border-white">
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          {/* 아이디 입력 필드 */}
          <div className="bg-white/opacity-20 absolute left-[47.5rem] top-[32rem] h-[3.75rem] w-[25rem] rounded-[1.25rem] border-2 border-white">
            <Input
              type="text"
              placeholder="아이디"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>

          {/* 로그인 제목 */}
          <div className="font-['Cafe24 Danjunghae'] absolute left-[52rem] top-[15.25rem] text-center text-[6rem] font-normal text-white">
            로그인
          </div>

          {/* 로그인 버튼 */}
          <div className="font-['Cafe24 Danjunghae'] absolute left-[47.5rem] top-[52.5rem] flex w-[25rem] items-center justify-center rounded-[1.25rem] text-2xl font-normal text-black">
            <Button type="button" label="로그인하기" onClick={handleSubmit} />
          </div>
        </div>
      </Background>
    </div>
  );
}

export default SignInPage;
