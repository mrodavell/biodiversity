import FileDropzone from "../filedropzone";
import { formatBytes } from "../../helpers/file";
import { FC, Fragment, useEffect, useState } from "react";
import { FaFile, FaFileAlt, FaTrash } from "react-icons/fa";
import { Watch } from "react-loader-spinner";

type TProps = {
    label?: string;
    fileType?: string[];
    maxSize?: number;
    files?: File[];
    setFiles?: (files: Array<File>) => void;
    removeFile?: (index: number) => void;
    isUploading?: boolean;
    editable?: boolean;
    maxFiles?: number;
}

const Attachments: FC<TProps> = ({
    label = 'Click or Drag and Drop Files',
    maxSize = 5242880,
    fileType = ['png', 'jpeg'],
    files = [],
    setFiles,
    removeFile,
    editable = true,
    isUploading = false,
    maxFiles = 0
}) => {
    const formattedMaxSize = formatBytes(maxSize);
    const [isAllowedSize, setIsAllowedSize] = useState<boolean>(true);
    const [isAllowedType, setIsAllowedType] = useState<boolean>(true);

    const checkFileType = () => {
        const isAllowed = files.find((file) => fileType.includes(file.type));

        if (isAllowed) {
            setIsAllowedType(false);
        } else {
            setIsAllowedType(true);
        }
    }

    const checkFileSize = () => {
        const isExceed = files.find((file) => file.size > maxSize);

        if (isExceed) {
            setIsAllowedSize(false);
        } else {
            setIsAllowedSize(true);
        }
    }

    const handleFile = (acceptedFiles: Array<File>) => {
        if (setFiles) {
            setFiles(acceptedFiles);
        }
    }

    const handleRemove = (index: number) => {
        if (removeFile) {
            removeFile(index);
        }
    }


    useEffect(() => {
        checkFileType();
        checkFileSize();
    }, [files]);


    return (
        <Fragment>
            {(files ?? []).length > 0 &&
                <Fragment>
                    {!isAllowedSize &&
                        <span className='text-center text-danger'>Some file size exceeds {formattedMaxSize}. Please select {formattedMaxSize} below file.</span>
                    }
                    {!isAllowedType &&
                        <span className='text-center text-danger'>Some file type is not allowed. Please select only allowed file type.</span>
                    }
                    {
                        (files ?? []).map((file, index) => {
                            return <div key={`file-attachment${index}`} className='flex flex-1 flex-row items-center justify-between border-[1px] p-2 border-slate-200 rounded-md mt-4'>
                                <div className='flex flex-row items-center ml-4'>
                                    <FaFileAlt size={30} className='mr-2' />
                                    <div className='flex flex-col'>
                                        <span className={`${file.size > maxSize ? '!text-danger' : '!text-primary'}`}>{file.name}</span>
                                        <span className={`${file.size > maxSize ? '!text-danger' : '!text-primary'}`}>{formatBytes(file.size)}</span>
                                    </div>
                                </div>
                                {editable && !isUploading &&
                                    <button type="button" className='btn-ghost text-slate mr-4 p-2 rounded-full' onClick={() => handleRemove(index)}>
                                        <FaTrash />
                                    </button>
                                }
                                {isUploading &&
                                    <div className="flex flex-row items-center mr-4">
                                        <Watch height={20} width={20} color="#26A844" />
                                    </div>
                                }
                            </div>
                        })
                    }
                </Fragment>
            }
            <Fragment>
                <FileDropzone setFiles={handleFile} maxFiles={maxFiles} height={120}>
                    {(files ?? []).length === 0 &&
                        <div className='flex flex-1 flex-col items-center'>
                            <FaFile size={30} className='mb-4' />
                            <span>
                                {label}
                            </span>
                            <span className='text-slate-400'>
                                Accepted File Type:  {fileType ? fileType.toString().toUpperCase() : 'PDF, PNG, JPEG'}
                            </span>
                        </div>
                    }
                    {(files ?? []).length > 0 &&
                        <div className='flex flex-1 flex-row items-center justify-center pt-1 space-x-2 mt-4'>
                            <span className="text-zinc-400">
                                (Drop files or click to add More Files)
                            </span>
                        </div>
                    }
                </FileDropzone>
            </Fragment>
        </Fragment>

    )
}

export default Attachments