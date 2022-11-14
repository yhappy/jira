import { useEffect, useState } from "react";

export const isFalsy = (value: any) => (value === 0 ? false : !value);

export const cleanObject = (object: object) => {
  const result = { ...object };
  Object.keys(result).forEach((keys) => {
    // @ts-ignore
    const value = result[keys];
    if (isFalsy(value)) {
      // @ts-ignore
      delete result[keys];
    }
  });
  return result;
};

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useDebounce = (value: any, delay?: number) => {
  const [debounceedValue, setDebounceedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceedValue(value);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debounceedValue;
};
