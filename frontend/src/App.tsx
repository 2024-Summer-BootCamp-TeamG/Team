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
import MainPage from "./pages/MainPage";
import LogoMusicPage from "./pages/LogoMusicPage";
import ChooseColorPage from "./pages/ChooseColorPage";

import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/textgeneration" element={<TextGenerationPage children={undefined} />} />
        <Route path="/musiccover" element={<MusicCoverGenerationPage />} />
        <Route path="/drag" element={<DragDrop />} />
        <Route path="/busin" element={<BusinessInputPage />} />
        <Route path="/texi" element={<TextInputPage />} />

        <Route path="/logomusic" element={<LogoMusicPage />} />
        <Route path="/main" element={<MainPage children={undefined} />} />
        <Route path="/logomusic" element={<LogoMusicPage />} />
        <Route path="/choosecolor" element={<ChooseColorPage />}/>

      </Routes>
    </>
  );
}

export default App;
