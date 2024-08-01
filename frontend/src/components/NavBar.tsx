import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '../assets/HomeIcon.svg';
import MenuIcon from '../assets/MenuIcon.svg';
import SignoutIcon from '../assets/SignoutIcon.svg';
import { Link } from 'react-router-dom';
import '../index.css';
import Icon from '../assets/Favicon.png';
function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  async function logout() {
    try {
      const response = await axios.post(
        'http://localhost:8000/users/signout',
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`, // 인증 토큰을 헤더에 추가합니다.
          },
        },
      );
      if (response.status === 200) {
        console.log('Logged out successfully');
        localStorage.removeItem('token'); // 로그아웃 후 인증 토큰을 로컬 스토리지에서 제거합니다.
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out', error);
    }

    navigate('/signin');
  }
  function handleHomeClick() {
    if (location.pathname === '/signup' || location.pathname === '/signin') {
      navigate('/');
    } else {
      navigate('/pictureupload');
    }
  }
  return (
    <div>
      <div className="absolute left-0 top-0 flex items-center justify-center p-4">
        <Link to="/main">
          <button
            type="button"
            className="mr-[1rem] flex flex-row items-center"
            onClick={handleHomeClick}
          >
            <img
              className="h-[2.2rem] w-[2.2rem]"
              src={HomeIcon}
              alt="홈 아이콘"
            />
            <p className="ml-[5px] mr-[10px] rounded text-[1.2rem] text-white">
              홈
            </p>
          </button>
        </Link>
        {location.pathname !== '/signup' && location.pathname !== '/signin' && (
          <Link to="/detail">
            <button type="button" className="flex flex-row items-center">
              <img
                className="h-[2.2rem] w-[2.2rem]"
                src={MenuIcon}
                alt="메뉴 아이콘"
              />
              <p className="ml-[5px] rounded text-[1.2rem] text-white">목록</p>
            </button>
          </Link>
        )}
      </div>
      <div className="absolute left-1/2 top-0 flex -translate-x-1/2 transform p-4 text-[1.2rem]">
        <img
          className="mr-[10px] mt-[15px] h-[40px] w-[40px]"
          src={Icon}
          alt="favicon"
        />
        <Link to="/pictureupload">
          <button>
            <p className="text-[3rem] text-white">Brandify</p>
          </button>
        </Link>
      </div>
      {location.pathname !== '/signup' && location.pathname !== '/signin' && (
        <div className="absolute right-0 top-0 flex items-center p-4">
          <button type="button" className="flex flex-row" onClick={logout}>
            <img
              className="h-[1.5rem] w-[1.5rem]"
              src={SignoutIcon}
              alt="메뉴 아이콘"
            />{' '}
            <p className="ml-[5px] rounded text-[1.2rem] text-white">
              로그아웃
            </p>
          </button>
        </div>
      )}
    </div>
  );
}

export default NavBar;
