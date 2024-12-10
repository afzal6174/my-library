import { useState } from "react";

const useToggle = (initialValue = false) => {
  const [isToggled, setIsToggled] = useState(initialValue);

  const toggle = () => {
    setIsToggled((prev) => !prev);
  };

  return [isToggled, toggle];
};

export default useToggle;
