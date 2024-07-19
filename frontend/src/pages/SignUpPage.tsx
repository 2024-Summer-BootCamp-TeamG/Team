import React, { useState } from 'react';
import axiosInstance from '../api/axios'; // axios.ts에서 import
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
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
      className="h-full w-full rounded-[1.25rem] border-gray-300 bg-white bg-opacity-30 p-2 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

const Button: React.FC<{
  type: 'button' | 'submit' | 'reset';
  label: string;
}> = ({ type, label }) => {
  return (
    <button
      type={type}
      className="h-[3.75rem] w-full rounded-[1.5rem] bg-white px-4 py-2 text-black hover:bg-black/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
    >
      {label}
    </button>
  );
};

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('/users/signup', {
        email,
        password,
      });

      if (response.status === 201) {
        alert('회원가입이 성공적으로 완료되었습니다.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        navigate('/signin');
      } else {
        alert('회원가입에 실패했습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          alert(
            `회원가입 도중 오류가 발생했습니다: ${error.response.data.message || error.response.data}`,
          );
        } else {
          alert('회원가입 도중 오류가 발생했습니다.');
        }
        console.error('There was an error!', error);
      } else {
        alert('회원가입 도중 예기치 않은 오류가 발생했습니다.');
        console.error('There was an unexpected error!', error);
      }
    }
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-cover">
      <Background>
        <NavBar />
        <div className="relative h-[67.5rem] w-[120rem]">
          <div className="absolute left-[35rem] top-[7.19rem] h-[53.13rem] w-[50rem] rounded-[2.5rem] border-2 border-white bg-white/30 opacity-60 shadow backdrop-blur-[3.44rem]" />
          <form onSubmit={handleSubmit}>
            <div className="bg-white/opacity-20 absolute left-[47.5rem] top-[30.18rem] h-[3.75rem] w-[25rem] rounded-[1.25rem] border-2 border-white">
              <Input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="bg-white/opacity-20 absolute left-[47.5rem] top-[36.35rem] h-[3.75rem] w-[25rem] rounded-[1.25rem] border-2 border-white">
              <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="bg-white/opacity-20 absolute left-[47.5rem] top-[42.52rem] h-[3.75rem] w-[25rem] rounded-[1.25rem] border-2 border-white">
              <Input
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>
            <div className="font-['Cafe24 Danjunghae'] absolute left-[49.5rem] top-[15.25rem] text-center text-[6rem] font-normal text-white">
              회원가입
            </div>
            <div className="font-['Cafe24 Danjunghae'] absolute left-[47.5rem] top-[52.5rem] flex w-[25rem] items-center justify-center text-2xl font-normal text-black">
              <Button type="submit" label="회원가입하기" />
            </div>
          </form>
        </div>
      </Background>
    </div>
  );
};

export default SignUpPage;
