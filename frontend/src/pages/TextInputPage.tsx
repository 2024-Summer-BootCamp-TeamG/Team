import React from 'react';

interface TextInputPageProps {
  className?: string;
}

const TextInputPage: React.FC<TextInputPageProps> = ({ className }) => {
  return (
    <div
      contentEditable
      className={`z-10 flex h-[12rem] w-[68rem] items-start justify-start rounded-[40px] border-2 border-white bg-gradient-to-b from-white/20 to-slate-400/10 shadow backdrop-blur-xl ${className}`}
      style={{
        backdropFilter: 'blur(10px)', // 블러 효과 적용
        WebkitBackdropFilter: 'blur(10px)', // 사파리 지원을 위해 추가
        height: '12rem', // 원하는 높이 설정
        width: '68rem', // 원하는 너비 설정
        padding: '1rem', // 내부 여백 설정
        color: 'white', // 텍스트 색상 설정
        overflow: 'auto', // 내용이 넘칠 경우 스크롤바 표시
        display: 'flex',
        flexDirection: 'column', // 텍스트를 위에서부터 작성
        justifyContent: 'flex-start', // 텍스트 정렬을 위쪽으로 설정
      }}
    />
  );
};

export default TextInputPage;
