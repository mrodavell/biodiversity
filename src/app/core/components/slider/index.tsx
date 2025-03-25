import { FC, Fragment, useRef, useState } from "react";
import { FaChevronCircleLeft, FaChevronCircleRight, FaTrash } from "react-icons/fa";
import { IImages } from "../../interfaces/common.interface";
import fallbackImg from "../../../../assets/fallback-image.jpg";
import ImageModal from "../imagemodal";
import { confirmArchive } from "../../helpers/alerts";

type SliderComponentProps = {
    items?: IImages[];
    allowEdit?: boolean;
    onDelete?: (image: IImages) => void;
}

const SliderComponent: FC<SliderComponentProps> = ({ items = [], allowEdit = false, onDelete }) => {

    const elementRef = useRef<HTMLDivElement>(null);

    const handleHorizontalScroll = (element: HTMLDivElement | null, speed: number | undefined, distance: number, step: number) => {

        let scrollAmount = 0;

        if (element === null) return;

        const slideTimer = setInterval(() => {
            element.scrollLeft += step;
            scrollAmount += Math.abs(step);
            if (scrollAmount >= distance) {
                clearInterval(slideTimer);
            }

        }, speed);
    }

    const [selectedImage, setSelectedImage] = useState<string>('');
    const [imageModal, setImageModal] = useState<boolean>(false);
    const toggleImageModal = () => setImageModal(!imageModal);

    const handleImageModal = (image: string) => {
        setSelectedImage(image);
        toggleImageModal();
    }

    const handleRemove = async (image: IImages) => {
        const isDelete = await confirmArchive("this image?");
        if (isDelete.isConfirmed) {
            if (onDelete) onDelete(image);
        }
    }


    return <Fragment>
        {imageModal && <ImageModal isOpen={imageModal} onClose={toggleImageModal}>
            <div className="flex flex-col">
                <img src={selectedImage} alt='Zoomed in avatar' className="w-[450px] h-full" />
            </div>
        </ImageModal>
        }
        <div className="flex flex-row  gap-x-2 w-full   items-center overflow-hidden">
            {items.length > 0 && (
                <button className="btn btn-ghost rounded-full" onClick={() => handleHorizontalScroll(elementRef.current, 25, 100, -10)}>
                    <FaChevronCircleLeft />
                </button>
            )}
            <div className="w-full h-44 gap-x-2 p-2 justify-start inline-flex items-center overflow-hidden" ref={elementRef}>
                {items.length === 0 && (
                    <div className="text-center flex flex-1 justify-center items-center border-[1px] rounded-md">
                        <img src={fallbackImg} alt="No image found" className="w-36" />
                    </div>
                )}

                {items.map((item, index) => {
                    if (item.sourceType === "gdrive") {
                        return (
                            <div key={index} className="shrink-0">
                                <img
                                    src={`https://drive.google.com/thumbnail?id=${item.imageUrl}&sz=w1000`}
                                    alt={item.speciesData?.commonName}
                                    className="w-40 cursor-pointer hover:opacity-80"
                                    onClick={() => handleImageModal(`https://drive.google.com/thumbnail?id=${item.imageUrl}&sz=w1000`)}
                                />
                                {allowEdit && (
                                    <div className="flex flex-1 justify-center items-center">
                                        <button
                                            className="btn btn-sm btn-ghost rounded-full mt-2"
                                            onClick={() => handleRemove(item)}
                                        >
                                            Remove <FaTrash className="text-red-500" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    }
                    return (
                        <div key={`${item.speciesData?.commonName}-${index}`} className="shrink-0">
                            <img
                                src={item.imageUrl}
                                alt={item.speciesData?.commonName}
                                className="w-36 cursor-pointer hover:opacity-80"
                                onClick={() => handleImageModal(item.imageUrl ?? '')}
                            />
                            {allowEdit && (
                                <div className="flex flex-1 justify-center items-center">
                                    <button
                                        className="btn btn-sm btn-ghost rounded-full mt-2"
                                        onClick={() => handleRemove(item)}
                                    >
                                        Remove <FaTrash className="text-red-500" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
            {items.length > 0 && (
                <button className="btn btn-ghost rounded-full" onClick={() => handleHorizontalScroll(elementRef.current, 25, 100, 10)}>
                    <FaChevronCircleRight />
                </button>
            )}
        </div>
    </Fragment>
}

export default SliderComponent;