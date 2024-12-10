import { useEffect } from "react";

function useOutsideClick(ref, handler, eventType = "pointerdown") {
  useEffect(() => {
    const handleClickEvent = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener(eventType, handleClickEvent);
    return () => {
      document.removeEventListener(eventType, handleClickEvent);
    };
  }, [ref, handler, eventType]);
}

export default useOutsideClick;
