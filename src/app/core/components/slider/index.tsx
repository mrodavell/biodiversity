import { FC, useRef } from "react";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { IImages } from "../../interfaces/common.interface";
import fallbackImg from "../../../../assets/fallback-image.jpg";

type SliderComponentProps = {
    items?: IImages[];
}

const SliderComponent: FC<SliderComponentProps> = ({ items = [] }) => {

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

    return (
        <div className="flex flex-row  gap-x-2 w-full   items-center overflow-hidden">
            {items.length > 0 && (
                <button className="btn btn-ghost rounded-full" onClick={() => handleHorizontalScroll(elementRef.current, 25, 100, -10)}>
                    <FaChevronCircleLeft />
                </button>
            )}
            <div className="w-full h-44 gap-x-2 p-2 justify-start overflow-hidden flex flex-row flex-nowrap" ref={elementRef}>
                {items.length === 0 && (
                    <div className="text-center flex flex-1 justify-center items-center border-[1px] rounded-md">
                        <img src={fallbackImg} alt="No image found" className="w-36" />
                    </div>
                )}

                {items.map((item, index) => {
                    if (item.sourceType === "gdrive") {
                        return (
                            <div key={index}>
                                <img src={`https://drive.google.com/thumbnail?id=${item.imageUrl}&sz=w1000`} alt={item.species.commonName} className="w-36" />
                            </div>
                        )
                    }
                    return (
                        <div key={`${item.speciesData?.commonName}-${index}`} className=" cursor-pointer hover:opacity-80">
                            <img
                                src={item.imageUrl}
                                alt={item.species.commonName}
                                className="w-36" />
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
    );
}

export default SliderComponent;