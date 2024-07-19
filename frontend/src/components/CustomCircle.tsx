import React from 'react';

interface CircleProps {
  size: string;
  left?: string;
  top: string;
  right?: string;
  backgroundColor: string;
}

const CustomCircle: React.FC<CircleProps> = ({
  size,
  left,
  top,
  right,
  backgroundColor,
}) => {
  return (
    <div
      className="animate-morphDramatic absolute"
      style={{
        backgroundColor,
        width: size,
        height: size,
        left,
        right,
        top,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    ></div>
  );
};

export default CustomCircle;
