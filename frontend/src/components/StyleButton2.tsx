// StyleButton2.tsx

import React from 'react';

interface StyleButtonProps {
  className: string;
  buttonText: string;
  isSelected: boolean;
  onToggle: () => void;
  style?: React.CSSProperties; // 추가: style prop을 받도록 설정
}

const StyleButton: React.FC<StyleButtonProps> = ({
  className,
  buttonText,
  isSelected,
  onToggle,
  style,
}) => {
  return (
    <button
      className={`${className} ${isSelected ? 'selected' : ''}`}
      style={style}
      onClick={onToggle}
    >
      {buttonText}
    </button>
  );
};

export default StyleButton;



