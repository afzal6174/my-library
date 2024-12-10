import { useEffect } from "react";

/**
 * Custom hook to handle any key event.
 * @param {string} targetKey - The key to listen for. Pass `null` to handle all keys.
 * @param {function} handler - The callback function to execute on key press.
 * @param {string} [eventType="keydown"] - The type of key event: `keydown`, `keyup`, or `keypress`.
 */
function useKey(targetKey, handler, eventType = "keydown") {
  useEffect(() => {
    const handleKeyEvent = (event) => {
      if (!targetKey || event.key === targetKey) {
        handler(event);
      }
    };

    window.addEventListener(eventType, handleKeyEvent);
    return () => {
      window.removeEventListener(eventType, handleKeyEvent);
    };
  }, [targetKey, handler, eventType]);
}

export default useKey;
