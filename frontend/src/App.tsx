import React from 'react';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import TextGenerationPage from './pages/TextGenerationPage';
import MusicCoverGenerationPage from './pages/MusicCoverGenerationPage';
import DragDrop from './pages/DragDrop';

import MainPage from './pages/MainPage';
import StyleButton from './components/StyleButton';

import BlurText from './components/Blurtext';
import TextInputPage from './pages/TextInputPage';
import SelectStylePage from './pages/SelectStylePage';
import PictureUploadPage from './pages/PictureUploadPage';

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
        <Route path="/main" element={<MainPage />} />
        <Route path="/stylebutton" element={<StyleButton />} />
        <Route path="/blurtext" element={<BlurText />} />
        <Route path="/textinput" element={<TextInputPage />} />
        <Route path="/selectstyle" element={<SelectStylePage />} />
        <Route path="/pictureupload" element={<PictureUploadPage />} />
      </Routes>
    </>
  );
}

export default App;
