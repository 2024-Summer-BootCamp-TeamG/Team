import React from 'react';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import TextGenerationPage from './pages/TextGenerationPage';
import MusicCoverGenerationPage from './pages/MusicCoverGenerationPage';
import BusinessInputPage from './pages/BusinessInputPage';
import TextInputPage from './pages/TextInputPage';

import DragDrop from './pages/DragDrop';

import MainPage from './pages/MainPage';
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/text-generation" element={<TextGenerationPage />} />
        <Route path="/musiccover" element={<MusicCoverGenerationPage />} />
        <Route path="/drag" element={<DragDrop />} />
        <Route path="/busin" element={<BusinessInputPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/texi" element={<TextInputPage />} />
      </Routes>
    </>
  );
}

export default App;
