import { Routes, Route } from 'react-router-dom';
import SignInPage from './pages/Users/SignInPage'; //로그인
import SignUpPage from './pages/Users/SignUpPage'; //로그아웃
import PictureUploadPage from './pages/Main/PictureUploadPage';
import BusinessInputPage from './pages/Steps/BusinessInputPage'; //step1
import TextInputPage from './pages/Steps/TextInputPage'; //step2
import ChooseColorPage from './pages/Steps/ChooseColorPage'; //step3
import SelectStylePage from './pages/Steps/SelectStylePage'; //step4
import ChooseStyle from './pages/.NotUsed/ChooseStylePage'; //step4

import MainPage from './pages/Main/MainPage'; //메인페이지
import LogoMusicPage from './pages/Results/LogoMusicResultPage'; //로고,음악,포스터 생성 페이지
import AlbumListPage from './pages/Results/AlbumListPage'; //지금까지 생성한 로고,음악 목록 페이지
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/main" element={<MainPage children={undefined} />} />
        <Route path="/textinput" element={<TextInputPage />} />
        <Route path="/pictureupload" element={<PictureUploadPage />} />
        <Route path="/business" element={<BusinessInputPage />} />
        <Route path="/" element={<MainPage children={undefined} />} />
        <Route path="/logomusic" element={<LogoMusicPage />} />
        <Route path="/choosecolor" element={<ChooseColorPage />} />
        <Route path="/choosestyle" element={<ChooseStyle />} />

        <Route path="/selectstyle" element={<SelectStylePage />} />
        <Route path="/albumlist" element={<AlbumListPage />} />
      </Routes>
    </>
  );
}

export default App;
