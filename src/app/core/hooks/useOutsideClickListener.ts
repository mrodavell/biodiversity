import { RefObject, useEffect } from "react";

type ClickOutsideComponentProps<T extends HTMLElement = HTMLElement> = {
  onOutsideClick?: () => void;
  ref: RefObject<T>;
  state: boolean;
};

export default function useOutsideClickListener<T extends HTMLElement>({
  onOutsideClick,
  ref,
  state,
}: ClickOutsideComponentProps<T>) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (state === true) {
          if (onOutsideClick) {
            onOutsideClick();
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onOutsideClick, ref, state]);
}
