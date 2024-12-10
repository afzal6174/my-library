import { useCallback, useEffect, useRef } from "react";

export default function useTimeoutFn(fn, ms = 0) {
  const ready = useRef(false);
  const timeout = useRef();
  const callback = useRef(fn);

  const isReady = useCallback(() => ready.current, []);

  const clear = useCallback(() => {
    ready.current = false;
    if (timeout.current) clearTimeout(timeout.current);
  }, []);

  const set = useCallback(() => {
    clear();

    timeout.current = setTimeout(() => {
      ready.current = true;
      callback.current();
    }, ms);
  }, [clear, ms]); // redundent dependency : clear

  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  useEffect(() => {
    set();
    return clear;
  }, [clear, ms, set]); // redundent dependency : clear, set

  return [isReady, clear, set];
}
