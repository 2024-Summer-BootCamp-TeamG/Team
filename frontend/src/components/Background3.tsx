export default function Background({ children }: BackgroundProps) {
  return (
<div className="relative flex h-screen w-screen flex-col items-center justify-center bg-black bg-cover" style={{backgroundImage: `url(${YourBackgroundImageUrl})`}}>

