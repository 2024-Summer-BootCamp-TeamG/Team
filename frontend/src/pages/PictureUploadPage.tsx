import React, {
  ChangeEvent,
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react';
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

const PictureUploadPage = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<IFileTypes[]>([]);

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
