import { useEffect } from "react";
import useTimeoutFn from "./useTimeOutFn";

export default function useDebounce(fn, ms = 0, deps = []) {
  const [isReady, cancel, reset] = useTimeoutFn(fn, ms);

  useEffect(reset, [reset, ...deps]); // redundent dependency : reset

  return [isReady, cancel];
}
