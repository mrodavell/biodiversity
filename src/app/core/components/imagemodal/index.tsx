import { FC, useEffect, useRef } from "react";

type Props = {
    title?: string;
    titleClass?: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    modalContainerClassName?: string;
    showCloseButton?: boolean;
    showHeader?: boolean;
};

const ImageModal: FC<Props> = ({
    isOpen,
    className,
    children,
    onClose
}) => {

    const modalRef = useRef<HTMLDivElement>(null);
    const modalContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            modalRef.current?.classList.remove("hidden");
        } else {
            modalRef.current?.classList.add("hidden");
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalContainerRef.current && !modalContainerRef.current.contains(event.target as Node) && isOpen) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <div ref={modalRef} id="custom-modal" tabIndex={-1} className={`fixed inset-0 z-150 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto ${className}`}>
            <div className="fixed inset-0 bg-black opacity-70"></div>
            <div ref={modalContainerRef} className="bg-white p-2 border-2 relative max-h-full">{children}</div>
        </div>
    );
};

export default ImageModal;
