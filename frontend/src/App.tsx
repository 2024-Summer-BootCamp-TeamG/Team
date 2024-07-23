import React from 'react';
import { RecoilRoot } from 'recoil';
import { Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import TextGenerationPage from './pages/TextGenerationPage';
import MusicCoverGenerationPage from './pages/MusicCoverGenerationPage';
import BusinessInputPage from './pages/BusinessInputPage';
import TextInputPage from './pages/TextInputPage';
import DetailedInquiryPage from './pages/DetailedInquiryPage';

import DragDrop from './pages/DragDrop';
import MainPage from './pages/MainPage';
import LogoMusicPage from './pages/LogoMusicPage';
import ChooseColorPage from './pages/ChooseColorPage';

import StyleButton from './components/StyleButton';

import BlurText from './components/Blurtext';
import SelectStylePage from './pages/SelectStylePage';
import PictureUploadPage from './pages/PictureUploadPage';
import CarouselPage from './pages/Carousel';

import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/textgeneration"
          element={<TextGenerationPage children={undefined} />}
        />
        <Route path="/musiccover" element={<MusicCoverGenerationPage />} />
        <Route path="/drag" element={<DragDrop />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/stylebutton" element={<StyleButton />} />
        <Route path="/blurtext" element={<BlurText />} />
        <Route path="/textinput" element={<TextInputPage />} />
        <Route path="/selectstyle" element={<SelectStylePage />} />
        <Route path="/pictureupload" element={<PictureUploadPage />} />
        <Route path="/busin" element={<BusinessInputPage />} />
        <Route path="/texi" element={<TextInputPage />} />
        <Route path="/carousel" element={<CarouselPage />} />
        <Route path="/detain" element={<DetailedInquiryPage />} />
        <Route path="/main" element={<MainPage children={undefined} />} />
        <Route path="/logomusic" element={<LogoMusicPage />} />
        <Route path="/choosecolor" element={<ChooseColorPage />} />
      </Routes>
    </>
  );
}

export default App;
