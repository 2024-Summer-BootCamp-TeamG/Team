import React from 'react';
import Background from '../components/Background';
import NavBar from '../components/NavBar';
function AlbumListPage() {
  return (
    <>
      <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-[#000000] bg-cover">
        <Background>
          <NavBar />
        </Background>
      </div>
    </>
  );
}

export default AlbumListPage;
