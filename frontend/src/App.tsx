import React from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import TextGenerationPage from "./pages/TextGenerationPage";
import MusicCoverGenerationPage from "./pages/MusicCoverGenerationPage";
import MainPage from "./pages/MainPage.tsx";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/text-generation" element={<TextGenerationPage />} />
        <Route path="/musiccover" element={<MusicCoverGenerationPage />} />
        <Route path="/mainpage" element={<MainPage/>}/>

      </Routes>
    </>
  );
}

export default App;
