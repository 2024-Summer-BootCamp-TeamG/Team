import React from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import TextGenerationPage from "./pages/TextGenerationPage";
import "./App.css";

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path="/text-generation" element={<TextGenerationPage />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
