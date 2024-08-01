import { Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import TextGenerationPage from './pages/TextGenerationPage';
import MusicCoverGenerationPage from './pages/MusicCoverGenerationPage';
import BusinessInputPage from './pages/BusinessInputPage';
import TextInputPage from './pages/TextInputPage';
import ChooseStylePage from './pages/ChooseStylePage';
import DetailedInquiryPage from './pages/DetailedInquiryPage';

import DragDrop from './pages/DragDrop';
import MainPage from './pages/MainPage';
import LogoMusicPage from './pages/LogoMusicPage';
import ChooseColorPage from './pages/ChooseColorPage';
import AlbumListPage from './pages/AlbumListPage';
import StyleButton from './components/StyleButton';

import BlurText from './components/Blurtext';
import SelectStylePage from './pages/SelectStylePage';
import PictureUploadPage from './pages/PictureUploadPage';
// import CarouselPage from './pages/Carousel';
import Raise from '../src/pages/raise/index';
import Star from './pages/starTest';

import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/textgeneration" element={<TextGenerationPage />} />
        <Route path="/musiccover" element={<MusicCoverGenerationPage />} />
        <Route path="/drag" element={<DragDrop />} />
        <Route path="/main" element={<MainPage children={undefined} />} />
        <Route path="/stylebutton" element={<StyleButton />} />
        <Route path="/blurtext" element={<BlurText children={undefined} />} />
        <Route path="/textinput" element={<TextInputPage />} />
        <Route path="/selectstyle" element={<SelectStylePage />} />
        <Route path="/pictureupload" element={<PictureUploadPage />} />
        <Route path="/business" element={<BusinessInputPage />} />
        {/* <Route path="/carousel" element={<CarouselPage />} /> */}
        <Route path="/detail" element={<DetailedInquiryPage />} />
        <Route path="/" element={<MainPage children={undefined} />} />
        <Route path="/logomusic" element={<LogoMusicPage />} />
        <Route path="/choosecolor" element={<ChooseColorPage />} />
        <Route path="/choosestyle" element={<ChooseStylePage />} />
        <Route path="/albumlist" element={<AlbumListPage />} />
        <Route path="/raise" element={<Raise />} />
        <Route path="/star" element={<Star />} />
      </Routes>
    </>
  );
}

export default App;
