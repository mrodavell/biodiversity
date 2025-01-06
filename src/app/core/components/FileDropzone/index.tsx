import { FC, Fragment, ReactNode, useCallback } from "react";
import Dropzone, { Accept } from "react-dropzone";

type TFileDropzoneProps = {
    children?: ReactNode | ReactNode[];
    width?: number;
    height?: number;
    maxFiles?: number;
    minSize?: number;
    maxSize?: number;
    allowedTypes?: Accept;
    setFiles: (files: File[]) => void;
};

const FileDropzone: FC<TFileDropzoneProps> = ({
    children,
    width,
    height,
    maxFiles = 1,
    minSize = 0,
    maxSize = 5242880,
    allowedTypes = { "image/*": [".jpg", ".jpeg", ".png", ".pdf"] },
    setFiles,
}) => {

    const handleDrop = useCallback((files: Array<File>) => {
        if (setFiles) {
            setFiles(files);
        }
    }, []);

    return (
        <Fragment>
            <Dropzone
                onDrop={(acceptedFiles) => handleDrop(acceptedFiles)}
                accept={allowedTypes}
                maxFiles={maxFiles}
                maxSize={maxSize}
                minSize={minSize}
            >
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div {...getRootProps()}>
                            <input hidden {...getInputProps} />
                            <div
                                className="flex flex-1 items-center"
                                style={{ width: width, height: height }}
                            >
                                {children}
                            </div>
                        </div>
                    </section>
                )}
            </Dropzone>
        </Fragment>
    );
};

export default FileDropzone;
