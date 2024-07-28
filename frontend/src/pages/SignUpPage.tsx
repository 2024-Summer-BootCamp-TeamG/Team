import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import Background from '../components/Background';
import NavBar from '../components/NavBar';
import '../index.css';

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
      className="h-[3rem] w-full rounded-[1.5rem] bg-white px-4 py-2 text-black hover:bg-black/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
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
      const response = await axios.post(
        'http://brandifyy.site/api/users/signup',
        {
          email,
          password,
        },
      );

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
      <div className="relative h-full w-full">
        <Background>
          <NavBar />
          <div className="mt-[5rem] flex items-center justify-center">
            <div className="flex-col items-center justify-around space-y-8">
              <div className="flex w-full items-center justify-between space-x-12 rounded-[2.5rem] border-2 border-white bg-white/30 opacity-60">
                <form
                  onSubmit={handleSubmit}
                  className="flex h-[35rem] w-[30rem] flex-col items-center justify-center rounded-xl bg-opacity-20"
                >
                  <div className="font-['Cafe24 Danjunghae'] mb-8 text-center text-[2rem] font-normal text-white">
                    회원가입
                  </div>
                  <div className="mb-6 h-[3rem] w-[20rem] rounded-[1.25rem] border-2 border-white bg-white/20">
                    <Input
                      type="email"
                      placeholder="아이디"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </div>
                  <div className="mb-6 h-[3rem] w-[20rem] rounded-[1.25rem] border-2 border-white bg-white/20">
                    <Input
                      type="password"
                      placeholder="비밀번호"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="mb-8 h-[3rem] w-[20rem] rounded-[1.25rem] border-2 border-white bg-white/20">
                    <Input
                      type="password"
                      placeholder="비밀번호 확인"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />
                  </div>
                  <div className="font-['Cafe24 Danjunghae'] mt-[2rem] flex h-[3rem] w-[20rem] items-center justify-center text-xl font-normal text-black">
                    <Button type="submit" label="회원가입하기" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Background>
      </div>
    </div>
  );
};

export default SignUpPage;
