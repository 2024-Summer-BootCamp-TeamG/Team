interface StyleButtonProps {
  buttonText?: string;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean; // 선택 상태를 전달받을 prop 추가
  onToggle?: () => void; // 토글 이벤트 핸들러 추가
}

function StyleButton({
  buttonText = 'example',
  className = '',
  isSelected = false,
  onToggle,
}: StyleButtonProps) {
  const handleClick = () => {
    if (onToggle) {
      onToggle(); // 토글 이벤트 핸들러 호출
    }
  };

  return (
    <div
      className={`relative z-10 flex justify-center self-center rounded-[60px] bg-gradient-to-b from-white/20 to-slate-400/10 shadow backdrop-blur-xl sm:mt-0 ${className} ${isSelected ? 'bg-white text-black' : ''}`}
    >
      <button
        type="button"
        className={`w-full rounded-[60px] border py-2 text-center text-[1.2rem] ${isSelected ? 'text-black' : 'text-white'} hover:bg-white hover:text-black`}
        onClick={handleClick}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default StyleButton;
