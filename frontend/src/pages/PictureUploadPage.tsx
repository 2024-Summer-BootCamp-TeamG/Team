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
        <div className="DragDrop h-[37.5rem] w-[37.5rem] items-center justify-center rounded-full border-4 border-dashed border-black bg-white opacity-80 shadow backdrop-blur-sm">
          <input
            type="file"
            id="fileUpload"
            style={{ display: 'none' }}
            multiple={true}
            onChange={onChangeFiles}
          />
          <label
            className={isDragging ? 'DragDrop-File-Dragging' : 'DragDrop-File'}
            htmlFor="fileUpload"
            ref={dragRef}
          >
            {files.length === 0 ? (
              <>
                <img src={UploadIcon} alt="upload" />
                <p className="text-[2rem]">사진 업로드하기</p>
                <p className="text-[2rem]">이미지를 드래그해주세요</p>
              </>
            ) : (
              <div className="DragDrop-ImagePreview"></div>
            )}
          </label>

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
                      <p className="text-[3rem]">X</p>
                      <img src={preview} alt={name} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Background>
    </div>
  );
};

export default PictureUploadPage;
