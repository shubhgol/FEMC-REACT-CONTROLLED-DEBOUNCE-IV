import { useEffect, useRef } from "react";

const useDebounce = (callback, wait, deps) => {
  const timerRef = useRef(null);
  const isMountRef = useRef(false);

  useEffect(() => {
    if (isMountRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        callback();
      }, wait);
    }
  }, [...deps]);

  useEffect(() => {
    isMountRef.current = true;
  }, []);
};

export default useDebounce;
