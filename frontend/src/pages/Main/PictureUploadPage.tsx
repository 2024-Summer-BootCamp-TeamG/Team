import { ChangeEvent, useCallback, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import UploadIcon from '../../assets/picUpload.png';
import Background from '../../components/Background';
import NavBar from '../../components/NavBar';
import CloseIcon from '../../assets/closeBtn.png';

interface IFileTypes {
  id: number;
  object: File;
  preview: string;
}

const PictureUploadPage = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<IFileTypes[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [logoUploaded, setLogoUploaded] = useState<boolean>(false); // 로고 업로드 상태 추가
  const [musicGenerated, setMusicGenerated] = useState<boolean>(false); // 음악 생성 상태 추가
  const [, setUserId] = useState<string | null>(null);

  const navigate = useNavigate();
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    console.log('1', storedUserId);
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      alert('로그인 정보가 없습니다. 로그인 페이지로 이동합니다.');
      navigate('/signin');
    }
  }, [navigate]);

  const dragRef = useRef<HTMLLabelElement | null>(null);
  const fileId = useRef<number>(0);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const percentRef = useRef<HTMLSpanElement | null>(null);

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
              preview: reader.result as string,
            },
          ];
          setFiles(tempFiles);
          console.log('File added:', file);
        };
        reader.readAsDataURL(file);
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
    // alert('dragIn 동작');

    console.log('드롭 영역에 진입');
  }, []);

  const handleDragOut = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    // alert('dragOver 동작');

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
    setIsUploading(true);
    setIsLoading(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('image', file.object);
    });

    try {
      const response = await axiosInstance.post(
        '/prompts/analysis_text',
        formData,
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        setLogoUploaded(true); // 로고 업로드 성공 시 상태 변경
        alert('이미지 업로드가 성공적으로 완료되었습니다.');

        // 이미지 업로드 성공 후 음악 생성 API 호출
        await generateMusic(formData);
      } else {
        alert('이미지 업로드에 실패했습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage =
            error.response.data.detail || JSON.stringify(error.response.data);
          console.log(JSON.stringify(error.response.data));
          alert(`이미지를 먼저 업로드해주세요! `);
          console.log(`${errorMessage}`);
        } else {
          alert('로고 생성 도중 오류가 발생했습니다.');
        }
        console.error('There was an error!', error);
      } else {
        alert('로고 생성 도중 예기치 않은 오류가 발생했습니다.');
        console.error('There was an unexpected error!', error);
      }
    } finally {
      setIsUploading(false);
      setIsLoading(false);
    }
  };

  // 추가된 부분: 음악 생성 함수
  const generateMusic = async (formData: FormData) => {
    try {
      const response = await axiosInstance.post(
        '/prompts/generate_textandmusic', // 음악 생성 엔드포인트
        formData, // 이미지 파일 포함한 FormData 전송
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        const taskId = response.data.task_id;
        localStorage.setItem('task_id', taskId);
        setMusicGenerated(true); // 음악 생성 성공 시 상태 변경
        alert('음악 생성이 성공적으로 완료되었습니다.');
        navigate('/business'); // 이동할 페이지로 네비게이션
      } else if (response.status === 202) {
        const taskId = response.data.task_id;
        localStorage.setItem('task_id', taskId);
        setMusicGenerated(true);
        console.log(
          '음악 생성이 요청되었습니다. 작업이 완료될 때까지 기다려 주세요.',
        );
        navigate('/business');
      } else {
        alert('음악 생성에 실패했습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage =
            error.response.data.detail || JSON.stringify(error.response.data);
          console.log(JSON.stringify(error.response.data));
          alert(`음악 생성 도중 오류가 발생했습니다: ${errorMessage}`);
        } else {
          alert('음악 생성 도중 오류가 발생했습니다.');
        }
        console.error('There was an error!', error);
      } else {
        alert('음악 생성 도중 예기치 않은 오류가 발생했습니다.');
        console.error('There was an unexpected error!', error);
      }
    }
  };

  useEffect(() => {
    initDragEvents();
    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    console.log(storedUserId);
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      alert('로그인 정보가 없습니다. 로그인 페이지로 이동합니다.');
      navigate('/signin');
    }
  }, [navigate]);

  useEffect(() => {
    if (isLoading) {
      let counter = 0;
      let progress = 0;
      const intervalId = setInterval(() => {
        if (progress >= 500 && counter >= 100) {
          clearInterval(intervalId);
          setIsLoading(false);
        } else {
          progress += 5;
          counter += 1;
          if (progressRef.current) {
            progressRef.current.style.width = progress + 'px';
          }
          if (percentRef.current) {
            percentRef.current.textContent = counter + '%';
          }
        }
      }, 170);
    }
  }, [isLoading]);

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-[#000000] bg-cover">
      <Background>
        <NavBar />
        {/* 로딩 중이 아닌 상태 */}
        {!isLoading && !logoUploaded && !musicGenerated && (
          <div className="flex w-full justify-around">
            <div className="relative mb-12 mr-16 flex flex-col items-center justify-center">
              <div className="DragDrop 0 mb-12 mt-20 flex h-[22.5rem] w-[22.5rem] items-center justify-center rounded-full border-4 border-dashed border-white bg-transparent p-6 backdrop-blur-2xl">
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
                    <p className="text-[1.5rem] text-white">사진 업로드하기</p>
                    <p className="text-[1rem] text-white">
                      이미지를 드래그해주세요
                    </p>
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
                            <img
                              style={{
                                marginLeft: '230px',

                                position: 'absolute',
                                zIndex: 1,
                              }}
                              src={CloseIcon}
                              alt="닫기"
                            />{' '}
                            <img src={preview} alt={name} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              {!isUploading ? (
                <button
                  className="left-[25rem] top-[56.25rem] h-[4.06rem] w-[30rem] rounded-[2.5rem] border-2 border-black bg-white text-center text-[1.5rem] text-black hover:border-white hover:bg-black hover:text-white"
                  onClick={uploadImages}
                >
                  브랜딩 start
                </button>
              ) : (
                <div className="flex w-[550px] flex-col items-center justify-center">
                  <div className="py-8 text-[2.5rem] font-semibold text-[#8AAAFF]">
                    <span ref={percentRef}>0%</span>
                  </div>
                  <div className="relative mx-auto h-[10px] w-[500px] overflow-hidden rounded-full bg-blue-200">
                    <div
                      ref={progressRef}
                      className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#8AAAFF] to-[#FA8CFF]"
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <div className="mb-[8rem] flex flex-col items-center justify-center">
              <div className="border-mint flex h-[15rem] w-[40rem] items-center justify-center rounded-[2.5rem] border-4 border-mint-gradient-end text-center font-['Inter'] text-4xl font-black tracking-wide text-cyan-50">
                <div className="font-['Cafe24 Danjunghae'] text-xl">
                  지금부터 나만의 브랜딩 작업 시작합니다!
                  <br />
                  로고와 포스터에 반영할 사진을 드래그 해주세요
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 로딩 중인 상태 */}
        {(isLoading || isUploading) && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="flex flex-col items-center">
              <div className="py-8 text-[2.5rem] font-semibold text-[#8AAAFF]">
                <span ref={percentRef}>0%</span>
              </div>
              <div className="relative mx-auto h-[10px] w-[500px] overflow-hidden rounded-full bg-blue-200">
                <div
                  ref={progressRef}
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#8AAAFF] to-[#FA8CFF]"
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* 로고 업로드 후 화면 */}
        {logoUploaded && !isLoading && !musicGenerated && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <img src={UploadIcon} alt="Logo" className="h-[200px] w-[200px]" />
          </div>
        )}

        {/* 음악 생성 후 화면 */}
        {/* {musicGenerated && !isLoading && !logoUploaded && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-2xl text-white">음악 생성이 완료되었습니다!</p>
          </div>
        )} */}
      </Background>
    </div>
  );
};

export default PictureUploadPage;
