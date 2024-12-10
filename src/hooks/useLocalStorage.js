import { useCallback, useEffect, useSyncExternalStore } from "react";

// const useLocalStorage = (storageKey, defaultValue) => {
//   const [value, setValue] = useState(
//     JSON.parse(localStorage.getItem(storageKey)) ?? defaultValue
//   );

//   useEffect(() => {
//     localStorage.setItem(storageKey, JSON.stringify(value));
//   }, [value, storageKey]);

//   return [value, setValue];
// };

function dispatchStorageEvent(key, newValue) {
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
}

export default useLocalStorage;
const setLocalStorageItem = (key, value) => {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
};

const removeLocalStorageItem = (key) => {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
};

const getLocalStorageItem = (key) => {
  return window.localStorage.getItem(key);
};

const useLocalStorageSubscribe = (callback) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getLocalStorageServerSnapshot = () => {
  throw Error("useLocalStorage is a client-only hook");
};

export function useLocalStorage(key, initialValue) {
  const getSnapshot = () => getLocalStorageItem(key);

  const store = useSyncExternalStore(
    useLocalStorageSubscribe,
    getSnapshot,
    getLocalStorageServerSnapshot
  );

  const setState = useCallback(
    (v) => {
      try {
        const nextState = typeof v === "function" ? v(JSON.parse(store)) : v;

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key);
        } else {
          setLocalStorageItem(key, nextState);
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [key, store]
  );

  useEffect(() => {
    if (
      getLocalStorageItem(key) === null &&
      typeof initialValue !== "undefined"
    ) {
      setLocalStorageItem(key, initialValue);
    }
  }, [key, initialValue]);

  return [store ? JSON.parse(store) : initialValue, setState];
}
