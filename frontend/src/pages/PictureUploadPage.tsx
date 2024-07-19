import React, {
  ChangeEvent,
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import UploadIcon from '../assets/UploadIcon.svg';
import Background from '../components/Background';
import NavBar from '../components/NavBar';
import CloseIcon from '../assets/CloseIcon.svg';
import { Link } from 'react-router-dom';
interface IFileTypes {
  id: number;
  object: File;
  preview: string; // 이미지 미리보기를 위한 URL
}
const uploadImageToServer = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('http://0.0.0.0:8000/prompts/analysis_text', {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      credentials: 'include', // 쿠키를 포함시키도록 설정
      body: formData,
    });

    if (!response.ok) {
      throw new Error('이미지 업로드 실패');
    }

    const data = await response.json();
    console.log('서버 응답:', data);
    // 서버 응답 처리 로직 추가
  } catch (error) {
    console.error('업로드 에러:', error);
  }
};

const PictureUploadPage = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<IFileTypes[]>([]);
  const navigate = useNavigate();

  const dragRef = useRef<HTMLLabelElement | null>(null);
  const fileId = useRef<number>(0);

  const onChangeFiles = useCallback(
    (e: ChangeEvent<HTMLInputElement> | DragEvent): void => {
      let selectFiles: File[] = [];
      let tempFiles: IFileTypes[] = files;

      if (e.type === 'drop') {
        selectFiles = Array.from((e as DragEvent).dataTransfer!.files);
      } else {
        selectFiles = Array.from(
          (e as ChangeEvent<HTMLInputElement>).target.files!,
        );
      }

      for (const file of selectFiles) {
        const reader = new FileReader();
        reader.onload = () => {
          tempFiles = [
            ...tempFiles,
            {
              id: fileId.current++,
              object: file,
              preview: reader.result as string, // 이미지 미리보기 URL 설정
            },
          ];
          setFiles(tempFiles);
          console.log('File added:', file);
          uploadImageToServer(file); // 파일을 추가할 때마다 서버로 전송
        };
        reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기
      }
    },
    [files],
  );

  const handleFilterFile = useCallback(
    (id: number): void => {
      setFiles(files.filter((file: IFileTypes) => file.id !== id));
    },
    [files],
  );

  const handleDragIn = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragOut = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer!.files) {
      setIsDragging(true);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();
      onChangeFiles(e);
      setIsDragging(false);
    },
    [onChangeFiles],
  );

  const initDragEvents = useCallback((): void => {
    if (dragRef.current !== null) {
      dragRef.current.addEventListener('dragenter', handleDragIn);
      dragRef.current.addEventListener('dragleave', handleDragOut);
      dragRef.current.addEventListener('dragover', handleDragOver);
      dragRef.current.addEventListener('drop', handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  const resetDragEvents = useCallback((): void => {
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener('dragenter', handleDragIn);
      dragRef.current.removeEventListener('dragleave', handleDragOut);
      dragRef.current.removeEventListener('dragover', handleDragOver);
      dragRef.current.removeEventListener('drop', handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  const uploadImages = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('image', file.object);
    });

    try {
      const response = await axios.post(
        'http://localhost:8000/prompts/analysis_text',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true, // 쿠키를 요청에 포함시키도록 설정
        },
      );

      if (response.status === 200) {
        alert('이미지 업로드가 성공적으로 완료되었습니다.');
        navigate('/busin'); // 이미지 업로드 성공 후 리다이렉션
      } else {
        alert('이미지 업로드에 실패했습니다.');
      }
    } catch (error) {
      alert('이미지 업로드 도중 오류가 발생했습니다.');
      console.error('There was an error!', error);
    }
  };

  useEffect(() => {
    initDragEvents();
    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-[#000000] bg-cover">
      <Background>
        <NavBar />
        <div className="relative flex w-full items-center justify-around">
          <div className="relative mb-12 mr-16 flex flex-col items-center justify-center">
            <div className="DragDrop mb-12 flex h-[37.5rem] w-[37.5rem] items-center justify-center rounded-full border-4 border-dashed border-black bg-white opacity-80 shadow backdrop-blur-sm">
              <input
                type="file"
                id="fileUpload"
                style={{ display: 'none' }}
                multiple={true}
                onChange={onChangeFiles}
              />
              {files.length === 0 && (
                <label
                  className={
                    isDragging ? 'DragDrop-File-Dragging' : 'DragDrop-File'
                  }
                  htmlFor="fileUpload"
                  ref={dragRef}
                >
                  <img src={UploadIcon} alt="upload" />
                  <p className="text-[2rem]">사진 업로드하기</p>
                  <p className="text-[2rem]">이미지를 드래그해주세요</p>
                </label>
              )}

              <div className="DragDrop-Files">
                {files.length > 0 &&
                  files.map((file: IFileTypes) => {
                    const {
                      id,
                      object: { name },
                      preview,
                    } = file;
                    return (
                      <div key={id}>
                        <div onClick={() => handleFilterFile(id)}>
                          <img src={CloseIcon} alt="닫기" />{' '}
                          <img src={preview} alt={name} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <Link to="/busin">
              <button className="left-[25rem] top-[56.25rem] h-[4.06rem] w-[30rem] rounded-[2.5rem] border-2 border-black bg-white text-center text-[1.5rem] text-black hover:border-white hover:bg-black hover:text-white">
                브랜딩 start
              </button>
            </Link>
          </div>

          <div className="mb-[8rem] flex flex-col items-center">
            <div className="flex h-[20rem] w-[50rem] items-center justify-center rounded-[2.5rem] border-4 border-white text-center font-['Inter'] text-4xl font-black tracking-wide text-cyan-50">
              <div>
                지금부터 나만의 브랜딩 작업 시작합니다!
                <br />
                로고와 포스터에 반영할 사진을 드래그 해주세요
              </div>
            </div>
          </div>
        </div>
      </Background>
    </div>
  );
};

export default PictureUploadPage;
