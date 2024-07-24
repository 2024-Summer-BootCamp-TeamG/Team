import React from 'react';
import './3d.css';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gray-200">
      <div className="pointer-events-none absolute left-1/2 top-10 h-4/5 w-full max-w-screen-xl -translate-x-1/2 transform bg-[url('/images/bg.png')] bg-cover bg-center bg-no-repeat" />
      <div className="banner relative z-10">
        <div
          className="slider flex space-x-4 overflow-hidden"
          style={{ '--quantity': 10 } as React.CSSProperties}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="item flex-shrink-0"
              style={{ '--position': i + 1 } as React.CSSProperties}
            >
              <img src="/assets/logo.png" alt={`Logo ${i + 1}`} />
            </div>
          ))}
        </div>
        <div className="content mt-8 text-center">
          <h1 className="text-6xl font-bold text-white">CSS ONLY</h1>
          <div className="author mt-4">
            <h2 className="text-4xl">LUN DEV</h2>
            <p className="text-xl font-bold">Web Design</p>
            <p className="text-lg">
              Subscribe to the channel to watch many interesting videos
            </p>
          </div>
          <div className="model mt-4"></div>
        </div>
      </div>
    </div>
  );
};

export default App;
