import React, { useState } from 'react';
import Background from '../components/Background.tsx';

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
      className="w-full rounded-[1.25rem] border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      className="w-full rounded-lg bg-white px-4 py-2 text-black hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  const handleSubmit = () => {
    alert(`Username: ${username}, Password: ${password}`);
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-[#000000] bg-cover">
      <Background>
        <div className="relative h-[67.5rem] w-[120rem] bg-black">
          {/* 로그인 박스 */}
          <div className="absolute left-[35rem] top-[7.19rem] h-[53.13rem] w-[50rem] rounded-[2.5rem] border-2 border-white bg-white opacity-60 shadow backdrop-blur-[3.44rem]" />

          {/* 비밀번호 입력 필드 */}
          <div className="bg-white/opacity-20 absolute left-[47.5rem] top-[36.35rem] h-[2.85rem] w-[25rem] rounded-[1.25rem] border-2 border-white">
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          {/* 아이디 입력 필드 */}
          <div className="bg-white/opacity-20 absolute left-[47.5rem] top-[30.13rem] h-[2.8rem] w-[25rem] rounded-[1.25rem] border-2 border-white">
            <Input
              type="text"
              placeholder="아이디"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>

          {/* 로그인 제목 */}
          <div className="font-['Cafe24 Danjunghae'] absolute left-[55.06rem] top-[15.25rem] text-center text-[4rem] font-normal text-white">
            로그인
          </div>

          {/* 로그인 버튼 */}
          <div className="font-['Cafe24 Danjunghae'] absolute left-[47.5rem] top-[52.5rem] flex w-[25rem] items-center justify-center text-xl font-normal text-black">
            <Button type="button" label="로그인하기" onClick={handleSubmit} />
          </div>
        </div>
      </Background>
    </div>
  );
}

export default SignInPage;
