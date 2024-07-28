import Background from '../components/Background.tsx';
import NavBar from '../components/NavBar.tsx';
function TextGenerationPage() {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-[#000000] bg-cover">
      <div className="relative h-full w-full">
        <Background>
          <NavBar />
          <div className="flex items-center justify-center space-x-28">
            <div className="relative top-36 mr-6 h-[35rem] w-[35rem] rounded-[2.5rem] border border-white bg-gradient-to-b from-white/20 to-slate-400/10 backdrop-blur-xl"></div>
            <img></img>
            <div className="relative top-36 ml-6 h-[43rem] w-[40rem] space-y-5 rounded-[2.5rem] border border-slate-50 bg-white/10 px-9 text-left shadow">
              <div className="bg-gradient-to-tl from-teal-400 to-fuchsia-400 bg-clip-text pt-5 text-2xl text-transparent">
                오늘 당신의 심리는?
              </div>
              <p className="text-4xl text-slate-50">안녕하세요 세연님</p>
              <p className="bg-clip-text text-xl text-white">
                미술 심리치료(Art Therapy)는 개인의 감정, 생각, 경험 등을 예술
                창작 활동을 통해 표현하고, 이를 통해 내면을 탐구하며 심리적 치료
                효과를 얻는 방법입니다. 미술 심리치료에서 그림을 해석하는 것은
                매우 중요한 과정 중 하나입니다. 그림에 나타난 색상, 구성, 상징
                등을 통해 내담자의 심리 상태를 파악할 수 있습니다. <br />
                <br />
                <br />
                전문가적 해석 1. <br />
                <br />
                집과 별 모양: <br />
                <br />
                <br />
                집: 집은 종종 안전, 안정, 가족, 그리고 자신을 표현하는 상징으로
                사용됩니다. 그림 속의 집은 전면에 위치하고 있으며 문이 중앙에
                있어 안정적이고 안전한 느낌을 줍니다. 별 모양: 별은 희망, 소망,
                꿈을 상징합니다. 집 위에 있는 별은 이 집이 희망과 꿈을 담고
                있다는 것을 나타낼 수 있습니다.
              </p>
            </div>
          </div>
          <div className="absolute bottom-7 left-1/2 flex h-[3rem] w-[17rem] -translate-x-1/2 transform items-center justify-center rounded-3xl border border-white bg-gray-800 text-center text-2xl font-normal text-white">
            다음
          </div>
        </Background>
      </div>
    </div>
  );
}
export default TextGenerationPage;
